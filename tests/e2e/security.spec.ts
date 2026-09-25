import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';

test('pages reject framing and disable MIME sniffing without exposing the framework header', async ({ request }) => {
  for (const path of ['/', '/missing-security-test-page']) {
    const response = await request.get(path);
    expect(response.status()).toBe(path === '/' ? 200 : 404);
    const headers = response.headers();
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(headers['content-security-policy']).toContain("object-src 'none'");
    expect(headers['content-security-policy']).toContain("base-uri 'self'");
    expect(headers['content-security-policy']).toContain("form-action 'self'");
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('no-referrer');
    expect(headers['x-powered-by']).toBeUndefined();
  }
});

test('HTML in an expense title is displayed as text and stays escaped after reload', async ({ page }) => {
  await page.goto('/');
  const payload = '<img src=x onerror="document.body.dataset.injected=1">';
  await page.getByPlaceholder('Title', { exact: true }).fill(payload);
  await page.getByPlaceholder('Amount', { exact: true }).fill('10');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('heading', { name: payload, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: payload, exact: true })).toBeVisible();
  await expect(page.locator('.expenses-list img')).toHaveCount(0);
  expect(await page.locator('body').getAttribute('data-injected')).toBeNull();
});

test('downloaded CSV protects full-width formulas and keeps injected separators in one cell', async ({ page }) => {
  await page.goto('/');
  const title = '＝1+1",=1+1';
  await page.getByPlaceholder('Title', { exact: true }).fill(title);
  await page.getByPlaceholder('Amount', { exact: true }).fill('10');
  await page.getByLabel('Date', { exact: true }).fill('2026-09-25');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const download = await pending;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const csv = Buffer.concat(chunks).toString('utf8');
  expect(csv).toContain('"\'＝1+1"",=1+1","10.00","2026-09-25"');
});
