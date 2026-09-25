import { test, expect, type Page } from '@playwright/test';

const records = [
  { id: 'groceries', title: 'Weekly groceries', amount: 30, date: '2025-06-10' },
  { id: 'train', title: 'Train tickets', amount: 12.5, date: '2026-02-15' },
  { id: 'coffee', title: 'Coffee', amount: 4.25, date: '2026-03-01' },
];

async function openWithStorage(page: Page, raw = JSON.stringify(records)) {
  // Seed only the first navigation; reloads must exercise actual persistence.
  await page.addInitScript(value => {
    if (!sessionStorage.getItem('test-data-initialized')) {
      localStorage.setItem('expense-tracker:v2', value);
      sessionStorage.setItem('test-data-initialized', 'true');
    }
  }, raw);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Weekly groceries', exact: true })).toBeVisible();
}

const titles = (page: Page) => page.locator('.expenses-list li h2');
const summary = (page: Page) => page.locator('.summary-card strong');

test('search ignores case and surrounding spaces, and clearing it preserves the year', async ({ page }) => {
  await openWithStorage(page);
  await page.getByLabel('Filter by year').selectOption('2026');
  await page.getByRole('textbox', { name: 'Search expenses' }).fill('  TRAIN  ');
  await expect(titles(page)).toHaveText(['Train tickets']);
  await expect(summary(page)).toHaveText(['$16.75', '2', '$8.38']);
  await page.getByRole('button', { name: 'Clear search', exact: true }).click();
  await expect(titles(page)).toHaveText(['Coffee', 'Train tickets']);
  await expect(page.getByLabel('Filter by year')).toHaveValue('2026');
  await expect(page.getByRole('button', { name: 'Clear search', exact: true })).toHaveCount(0);
});

test('reset from the empty state clears both search and year filters', async ({ page }) => {
  await openWithStorage(page);
  await page.getByLabel('Filter by year').selectOption('2025');
  await page.getByRole('textbox', { name: 'Search expenses' }).fill('Coffee');
  const emptyState = page.locator('.expenses-list__fallback');
  await expect(emptyState.getByRole('heading', { name: 'No matching expenses' })).toBeVisible();
  await emptyState.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.getByRole('textbox', { name: 'Search expenses' })).toHaveValue('');
  await expect(page.getByLabel('Filter by year')).toHaveValue('all');
  await expect(titles(page)).toHaveText(['Coffee', 'Train tickets', 'Weekly groceries']);
  await expect(summary(page)).toHaveText(['$46.75', '3', '$15.58']);
});

test('sorting changes transaction order without changing totals', async ({ page }) => {
  await openWithStorage(page);
  await expect(titles(page)).toHaveText(['Coffee', 'Train tickets', 'Weekly groceries']);
  await page.getByLabel('Sort by').selectOption('highest');
  await expect(titles(page)).toHaveText(['Weekly groceries', 'Train tickets', 'Coffee']);
  await expect(summary(page)).toHaveText(['$46.75', '3', '$15.58']);
  await page.getByLabel('Sort by').selectOption('newest');
  await expect(titles(page)).toHaveText(['Coffee', 'Train tickets', 'Weekly groceries']);
});

test('deleting the final expense in a year retains the selected filter and supports undo', async ({ page }) => {
  await openWithStorage(page);
  await page.getByLabel('Filter by year').selectOption('2025');
  await page.getByRole('button', { name: 'Delete Weekly groceries', exact: true }).click();
  await expect(page.getByLabel('Filter by year')).toHaveValue('2025');
  await expect(summary(page)).toHaveText(['$0.00', '0', '$0.00']);
  await expect(page.getByRole('heading', { name: 'No matching expenses' })).toBeVisible();
  await page.getByRole('button', { name: 'Undo deletion of Weekly groceries', exact: true }).click();
  await expect(titles(page)).toHaveText(['Weekly groceries']);
  await expect(summary(page)).toHaveText(['$30.00', '1', '$30.00']);
  await page.reload();
  await expect(titles(page)).toHaveCount(3);
});

test('form rejects blank titles and negative amounts, then accepts amounts above 500 with cents', async ({ page }) => {
  await openWithStorage(page);
  const title = page.getByPlaceholder('Title', { exact: true });
  const amount = page.getByPlaceholder('Amount', { exact: true });
  await title.fill('   ');
  await amount.fill('10');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Please enter a title' })).toBeVisible();
  await expect(titles(page)).toHaveCount(3);
  await title.fill('New laptop');
  await amount.fill('-1');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(amount).toBeFocused();
  await expect(titles(page)).toHaveCount(3);
  await amount.fill('999.99');
  await page.getByLabel('Date', { exact: true }).fill('2026-04-10');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Added “New laptop”.' })).toBeVisible();
  await expect(title).toHaveValue('');
  await expect(amount).toHaveValue('');
  await expect(titles(page)).toHaveCount(4);
  await expect(page.locator('li').filter({ has: page.getByRole('heading', { name: 'New laptop', exact: true }) })).toContainText('$999.99');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'New laptop', exact: true })).toBeVisible();
});

test('canceling an edit leaves the saved expense unchanged', async ({ page }) => {
  await openWithStorage(page);
  await page.getByRole('button', { name: 'Edit Coffee', exact: true }).click();
  const form = page.locator('li form');
  await expect(form.getByLabel('Title', { exact: true })).toBeFocused();
  await form.getByLabel('Title', { exact: true }).fill('Changed coffee');
  await form.getByLabel('Amount', { exact: true }).fill('100');
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(titles(page)).toHaveText(['Coffee', 'Train tickets', 'Weekly groceries']);
  await page.reload();
  await expect(summary(page)).toHaveText(['$46.75', '3', '$15.58']);
});

test('mobile quick-add brings the form into view without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openWithStorage(page);
  await page.getByRole('button', { name: 'New expense', exact: true }).click();
  const title = page.getByPlaceholder('Title', { exact: true });
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('corrupt saved data stays untouched when temporary changes are made', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('expense-tracker:v2', '{invalid json'));
  await page.goto('/');
  await expect(page.getByRole('status').filter({ hasText: 'Existing storage was left untouched' })).toBeVisible();
  await page.getByPlaceholder('Title', { exact: true }).fill('Temporary expense');
  await page.getByPlaceholder('Amount', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Add Expense', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Temporary expense', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('expense-tracker:v2'))).toBe('{invalid json');
});
