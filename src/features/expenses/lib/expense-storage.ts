import type { Expense } from '../types';

export const STORAGE_KEY = 'expense-tracker:v2';
export const LEGACY_STORAGE_KEY = 'expense-tracker:v1';
export const STORAGE_LOCK = 'expense-tracker:write';

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

// Legacy timestamps did not retain their original timezone. Preserve the date
// currently displayed during migration, then leave the v1 value as a backup.
function migrateDate(value: string): string {
  if (isCalendarDate(value)) return value;
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) throw new Error('Invalid saved expense');
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid saved expense');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Reject the whole collection so invalid records are never silently discarded.
export function restoreExpenses(raw: string, legacy = false): Expense[] {
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Invalid saved expenses');
  const ids = new Set<string>();
  return rows.map(row => {
    if (!row || typeof row.id !== 'string' || !row.id.trim() || ids.has(row.id) ||
        typeof row.title !== 'string' || !row.title.trim() ||
        typeof row.amount !== 'number' || !Number.isFinite(row.amount) || row.amount < 0 ||
        typeof row.date !== 'string') throw new Error('Invalid saved expense');
    const date = legacy ? migrateDate(row.date) : row.date;
    if (!isCalendarDate(date)) throw new Error('Invalid saved expense');
    ids.add(row.id);
    return { id: row.id, title: row.title, amount: row.amount, date };
  });
}

export type ExpenseChange =
  | { type: 'add'; expense: Expense }
  | { type: 'update'; expense: Expense; original: Expense }
  | { type: 'delete'; original: Expense };

export class ExpenseConflictError extends Error {
  constructor() { super('This expense changed in another tab. Review the latest record and try again.'); }
}

// Apply one user action to the latest list, rather than persisting a stale snapshot.
export function applyExpenseChange(items: Expense[], change: ExpenseChange): Expense[] {
  if (change.type === 'add') {
    if (items.some(item => item.id === change.expense.id)) throw new ExpenseConflictError();
    return [change.expense, ...items];
  }
  const current = items.find(item => item.id === change.original.id);
  if (!current || current.title !== change.original.title || current.amount !== change.original.amount || current.date !== change.original.date) {
    throw new ExpenseConflictError();
  }
  return change.type === 'delete'
    ? items.filter(item => item.id !== change.original.id)
    : items.map(item => item.id === change.original.id ? { ...change.expense, id: item.id } : item);
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
  // Calendar dates are already timezone-independent and need no conversion.
  const rows = expenses.map(expense => [expense.title, expense.amount.toFixed(2), expense.date].map(cell).join(','));
  return ['Title,Amount,Date', ...rows].join('\r\n') + '\r\n';
}
