import type { Expense } from '@/features/expenses/types';

export const STORAGE_KEY = 'expense-tracker:v1';
// Reject the entire saved collection rather than silently dropping invalid rows.
// The caller can then preserve the original storage for recovery.
export function restoreExpenses(raw: string): Expense[] {
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Invalid saved expenses');
  const ids = new Set<string>();
  // Unique IDs are required by list keys and ID-based edit/delete operations.
  return rows.map(row => {
    if (!row || typeof row.id !== 'string' || ids.has(row.id) ||
        typeof row.title !== 'string' || !row.title.trim() ||
        typeof row.amount !== 'number' || !Number.isFinite(row.amount) || row.amount < 0 ||
        typeof row.date !== 'string' || !Number.isFinite(Date.parse(row.date))) {
      throw new Error('Invalid saved expense');
    }
    ids.add(row.id);
    // TODO: Store calendar dates without a time zone; these instants can display
    // on a different day after the user's time zone changes.
    return { id: row.id, title: row.title, amount: row.amount, date: new Date(row.date) };
  });
}

export function expensesCsv(expenses: Expense[]): string {
  const cell = (value: string) => {
    // Normalize only for detection: some spreadsheet locales interpret full-width
    // formula prefixes as ASCII. Preserve the original text in the exported cell.
    const prefix = value.trimStart().normalize('NFKC');
    const firstCode = prefix.charCodeAt(0);
    const unsafe = /^[=+\-@]/.test(prefix) || /^\s*[\t\r\n]/.test(value) || firstCode < 32 || firstCode === 127;
    const safe = unsafe ? `'${value}` : value;
    // Quoting every field preserves commas/newlines; embedded quotes are doubled.
    return `"${safe.replace(/"/g, '""')}"`;
  };
  // Match the calendar date shown in the UI instead of converting it back to UTC.
  const rows = expenses.map(expense => [expense.title, expense.amount.toFixed(2),
    `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}-${String(expense.date.getDate()).padStart(2, '0')}`
  ].map(cell).join(','));
  return ['Title,Amount,Date', ...rows].join('\r\n') + '\r\n';
}
