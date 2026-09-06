"use client";

import React, { useEffect, useState } from 'react';
import { STORAGE_KEY, restoreExpenses, expensesCsv } from '../shared/expenseStorage';
import Expenses from './components/Expenses/Expenses';
import NewExpense from './components/NewExpense/NewExpense';
import { Expense } from '../shared/types/Types';

const DUMMY_EXPENSES: Array<Expense> = [
  {
    id: 'e1',
    title: 'Toilet Paper',
    amount: 94.12,
    date: new Date(2020, 7, 14),
  },
  {
    id: 'e2',
    title: 'New TV',
    amount: 799.49,
    date: new Date(2021, 2, 12)
  },
  {
    id: 'e3',
    title: 'Car Insurance',
    amount: 294.67,
    date: new Date(2021, 2, 28),
  },
  {
    id: 'e4',
    title: 'New Desk (Wooden)',
    amount: 450,
    date: new Date(2021, 5, 12),
  },
];

const Home = ({ }): JSX.Element => {
  const [expensesList, setExpensesList] = useState(DUMMY_EXPENSES);
  const [storageReady, setStorageReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [removed, setRemoved] = useState<Expense | null>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) setExpensesList(restoreExpenses(saved));
      setStorageReady(true);
    } catch {
      setNotice('Saved data could not be loaded. Existing storage was left untouched; changes are temporary.');
    }
  }, []);
  useEffect(() => {
    if (!storageReady) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expensesList)); }
    catch { setNotice('Storage is unavailable. Export a CSV to keep your changes.'); }
  }, [expensesList, storageReady]);

  const updateExpense = (updated: Expense) => setExpensesList(items => items.map(item => item.id === updated.id ? updated : item));
  const deleteExpense = (expense: Expense) => {
    setRemoved(expense);
    setExpensesList(items => items.filter(item => item.id !== expense.id));
  };
  const exportExpenses = () => {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + expensesCsv(expensesList)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const addExpenseHandler = (expense: Expense): void => {
    setExpensesList(prevExpenses => {
      return [expense, ...prevExpenses];
    });
  };

  return (
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <div className="new-expense">
        <button onClick={exportExpenses}>Export CSV</button>
        {notice && <p role="status">{notice}</p>}
        {removed && <button onClick={() => { setExpensesList(items => [removed, ...items]); setRemoved(null); }}>Undo deletion of {removed.title}</button>}
      </div>
      <Expenses expenses={expensesList} onUpdate={updateExpense} onDelete={deleteExpense} />
    </div>
  )
}

export default Home;
