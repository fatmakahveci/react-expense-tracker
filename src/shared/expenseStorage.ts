import type { Expense } from './types/Types';

export const STORAGE_KEY = 'expense-tracker:v1';
export function restoreExpenses(raw: string): Expense[] {
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Invalid saved expenses');
  const ids = new Set<string>();
  return rows.map(row => {
    if (!row || typeof row.id !== 'string' || ids.has(row.id) ||
        typeof row.title !== 'string' || !row.title.trim() ||
        typeof row.amount !== 'number' || !Number.isFinite(row.amount) || row.amount < 0 ||
        typeof row.date !== 'string' || !Number.isFinite(Date.parse(row.date))) {
      throw new Error('Invalid saved expense');
    }
    ids.add(row.id);
    return { id: row.id, title: row.title, amount: row.amount, date: new Date(row.date) };
  });
}

export function expensesCsv(expenses: Expense[]): string {
  const cell = (value: string) => {
    // Prevent spreadsheet formula execution, including after leading whitespace.
    const safe = /^[=+\-@]/.test(value.trimStart()) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const rows = expenses.map(expense => [expense.title, expense.amount.toFixed(2),
    `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}-${String(expense.date.getDate()).padStart(2, '0')}`
  ].map(cell).join(','));
  return ['Title,Amount,Date', ...rows].join('\r\n') + '\r\n';
}
