"use client";

import { useEffect, useState } from 'react';
import { SAMPLE_EXPENSES } from '../data/sample-expenses';
import { STORAGE_KEY, restoreExpenses, expensesCsv } from '../lib/expense-storage';
import type { Expense } from '../types';

export function useExpenses() {
  const [expensesList, setExpensesList] = useState(SAMPLE_EXPENSES);
  const [storageReady, setStorageReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState<Expense | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // A saved empty list is intentional; only a missing key keeps the sample data.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Read browser-only storage after hydration, before allowing writes.
      if (saved !== null) setExpensesList(restoreExpenses(saved));
      setStorageReady(true);
    } catch {
      setNotice('Saved data could not be loaded. Existing storage was left untouched; changes are temporary.');
    }
  }, []);
  useEffect(() => {
    // Read and validate first so sample data cannot overwrite saved records.
    // A failed read leaves this gate closed, keeping later edits temporary.
    if (!storageReady) return;
    // TODO: Coordinate writes across tabs; a stale tab can overwrite newer records.
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expensesList)); }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Surface external storage failures without changing expense state.
    catch { setNotice('Storage is unavailable. Export a CSV to keep your changes.'); }
  }, [expensesList, storageReady]);

  const updateExpense = (updated: Expense) => setExpensesList(items => items.map(item => item.id === updated.id ? updated : item));
  const deleteExpense = (expense: Expense) => {
    // Undo retains only the most recent deletion for this mounted session.
    setRemoved(expense);
    setExpensesList(items => items.filter(item => item.id !== expense.id));
  };
  const exportExpenses = () => {
    // The UTF-8 BOM helps spreadsheet applications recognize non-ASCII titles.
    const url = URL.createObjectURL(new Blob(['\uFEFF' + expensesCsv(expensesList)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    link.click();
    // Give the browser time to start the download before releasing the Blob URL.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const addExpenseHandler = (expense: Expense): void => {
    setExpensesList(prevExpenses => {
      return [expense, ...prevExpenses];
    });
  };

  const undoDeleteExpense = () => {
    if (!removed) return;
    setExpensesList(items => [removed, ...items]);
    setRemoved(null);
  };

  return {
    expensesList,
    notice,
    removed,
    addExpenseHandler,
    updateExpense,
    deleteExpense,
    undoDeleteExpense,
    exportExpenses,
  };
}
