import { test, expect } from '@playwright/test';

test('expenses persist and support editing, deletion, undo and CSV export', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Title', { exact: true }).fill('Train tickets');
  await page.getByPlaceholder('Amount', { exact: true }).fill('24.5');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Train tickets', exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Edit Train tickets', exact: true }).click();
  const form = page.locator('li form');
  await form.getByLabel('Title').fill('Rail tickets');
  await form.getByLabel('Amount').fill('32.5');
  await form.getByRole('button', { name: 'Save changes' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Rail tickets', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Delete Rail tickets', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Rail tickets', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo deletion of Rail tickets', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Rail tickets', exact: true })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await download).suggestedFilename()).toBe('expenses.csv');
});

test('a saved empty list stays empty after reload', async ({ page }) => {
  await page.goto('/');
  // Wait for initial hydration and persistence before replacing saved data.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('expense-tracker:v1'))).not.toBeNull();
  await page.evaluate(() => localStorage.setItem('expense-tracker:v1', '[]'));
  await page.reload();
  await expect(page.getByRole('button', { name: /^Delete / })).toHaveCount(0);
});
