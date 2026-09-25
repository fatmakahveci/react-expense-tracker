import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function fill(page: Page, title: string) {
  await page.getByPlaceholder('Title', { exact: true }).fill(title);
  await page.getByPlaceholder('Amount', { exact: true }).fill('10');
  await page.getByLabel('Date', { exact: true }).fill('2026-01-01');
}

test('simultaneous additions survive in both tabs and stale edits cannot overwrite changes', async ({ page, context }) => {
  await page.goto('/');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('expense-tracker:v2'))).not.toBeNull();
  const second = await context.newPage();
  await second.goto('/');
  await fill(page, 'First tab');
  await fill(second, 'Second tab');
  await Promise.all([page.getByRole('button', { name: 'Add Expense', exact: true }).click(), second.getByRole('button', { name: 'Add Expense', exact: true }).click()]);
  for (const tab of [page, second]) {
    for (const title of ['First tab', 'Second tab']) await expect(tab.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await tab.getByRole('button', { name: 'Edit First tab', exact: true }).click();
  }
  await page.locator('li form').getByLabel('Title', { exact: true }).fill('Stale edit');
  await second.locator('li form').getByLabel('Title', { exact: true }).fill('Latest edit');
  await second.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('expense-tracker:v2'))).toContain('Latest edit');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'changed in another tab' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Latest edit', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Second tab', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Stale edit', exact: true })).toHaveCount(0);
});

test('legacy migration keeps its backup and calendar dates survive a timezone change and CSV export', async ({ browser }) => {
  const london = await browser.newContext({ timezoneId: 'Europe/London' });
  const page = await london.newPage();
  const legacy = JSON.stringify([{ id: 'legacy', title: 'New year', amount: 10, date: '2026-01-01T00:00:00.000Z' }]);
  await page.addInitScript(raw => localStorage.setItem('expense-tracker:v1', raw), legacy);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'New year', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('expense-tracker:v1'))).toBe(legacy);
  const state = await london.storageState();
  const la = await browser.newContext({ timezoneId: 'America/Los_Angeles', storageState: state });
  const other = await la.newPage();
  await other.goto('/');
  await other.getByLabel('Filter by year').selectOption('2026');
  await expect(other.getByRole('heading', { name: 'New year', exact: true })).toBeVisible();
  await other.getByRole('button', { name: 'Edit New year', exact: true }).click();
  await expect(other.locator('li form').getByLabel('Date', { exact: true })).toHaveValue('2026-01-01');
  const download = other.waitForEvent('download');
  await other.getByRole('button', { name: 'Export CSV', exact: true }).click();
  const path = await (await download).path();
  expect(await readFile(path!, 'utf8')).toContain('"2026-01-01"');
  await la.close();
  await london.close();
});

test('browsers without Web Locks preserve storage and offer temporary editing', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'locks', { value: undefined }));
  await page.goto('/');
  await expect(page.getByRole('status').filter({ hasText: 'Safe shared storage is unavailable' })).toBeVisible();
  await fill(page, 'Temporary');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Temporary', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('expense-tracker:v2'))).toBeNull();
});
