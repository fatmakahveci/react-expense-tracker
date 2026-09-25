"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { SAMPLE_EXPENSES } from '../data/sample-expenses';
import {
  STORAGE_KEY, LEGACY_STORAGE_KEY, STORAGE_LOCK, restoreExpenses, expensesCsv,
  applyExpenseChange, ExpenseConflictError, type ExpenseChange,
} from '../lib/expense-storage';
import type { Expense } from '../types';

export function useExpenses() {
  const [expensesList, setExpensesList] = useState(SAMPLE_EXPENSES);
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState<Expense | null>(null);
  const current = useRef(SAMPLE_EXPENSES);
  const persistent = useRef(false);
  const initialization = useRef<Promise<void> | null>(null);
  const publish = useCallback((items: Expense[]) => {
    current.current = items;
    setExpensesList(items);
  }, []);

  useEffect(() => {
    let active = true;
    const initialize = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const legacy = saved === null ? localStorage.getItem(LEGACY_STORAGE_KEY) : null;
      const items = saved !== null ? restoreExpenses(saved)
        : legacy !== null ? restoreExpenses(legacy, true) : SAMPLE_EXPENSES;
      if (navigator.locks) {
        // Migration and first-use seeding share the same lock as all later writes.
        if (saved === null) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        persistent.current = true;
      } else {
        setNotice('Safe shared storage is unavailable. Changes are temporary; export a CSV to keep them.');
      }
      publish(items);
    };
    initialization.current = (async () => {
      try {
        if (navigator.locks) await navigator.locks.request(STORAGE_LOCK, () => { if (active) initialize(); });
        else if (active) initialize();
      } catch {
        if (active) {
          persistent.current = false;
          setNotice('Saved data could not be loaded. Existing storage was left untouched; changes are temporary.');
        }
      }
    })();

    const synchronize = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || (event.key !== STORAGE_KEY && event.key !== null) || !persistent.current) return;
      // Read the latest value under the lock, not a possibly outdated event payload.
      void navigator.locks.request(STORAGE_LOCK, () => {
        if (active && persistent.current) publish(restoreExpenses(localStorage.getItem(STORAGE_KEY) ?? '[]'));
      }).catch(() => {
        if (active) {
          persistent.current = false;
          setNotice('Saved data changed unexpectedly. Existing storage was left untouched; changes are temporary.');
        }
      });
    };
    window.addEventListener('storage', synchronize);
    return () => { active = false; window.removeEventListener('storage', synchronize); };
  }, [publish]);

  const changeExpense = async (change: ExpenseChange): Promise<boolean> => {
    await initialization.current;
    try {
      if (!persistent.current) {
        publish(applyExpenseChange(current.current, change));
        return true;
      }
      return await navigator.locks.request(STORAGE_LOCK, () => {
        if (!persistent.current) {
          publish(applyExpenseChange(current.current, change));
          return true;
        }
        const latest = restoreExpenses(localStorage.getItem(STORAGE_KEY) ?? '[]');
        publish(latest);
        const next = applyExpenseChange(latest, change);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Keep this action available for export, but never overwrite newer data later.
          persistent.current = false;
          setNotice('Storage is unavailable. Changes are temporary; export a CSV to keep your changes.');
        }
        publish(next);
        return true;
      });
    } catch (error) {
      setNotice(error instanceof ExpenseConflictError ? error.message
        : 'Saved data could not be updated. Existing storage was left untouched; export your changes before reloading.');
      return false;
    }
  };

  const addExpenseHandler = (expense: Expense) => changeExpense({ type: 'add', expense });
  const updateExpense = (expense: Expense, original: Expense) => changeExpense({ type: 'update', expense, original });
  const deleteExpense = async (original: Expense) => {
    if (await changeExpense({ type: 'delete', original })) setRemoved(original);
  };
  const undoDeleteExpense = async () => {
    if (removed && await changeExpense({ type: 'add', expense: removed })) setRemoved(null);
  };
  const exportExpenses = () => {
    // The BOM preserves Unicode titles in spreadsheet applications.
    const url = URL.createObjectURL(new Blob(['\uFEFF' + expensesCsv(current.current)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return { expensesList, notice, removed, addExpenseHandler, updateExpense, deleteExpense, undoDeleteExpense, exportExpenses };
}
