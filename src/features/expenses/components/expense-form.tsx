"use client";

import { FC, useState } from 'react';
import { isCalendarDate } from '../lib/expense-storage';
import { Expense } from '@/features/expenses/types';
import './expense-form.css';

const ExpenseForm: FC<{ onSaveExpenseData: (expense: Omit<Expense, 'id'>) => Promise<boolean> }> = ({ onSaveExpenseData }) => {
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [hasError, setHasError] = useState(false);
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    return <form onSubmit={async event => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const title = String(data.get('title') || '').trim();
        const amount = Number(data.get('amount'));
        const date = String(data.get('date') || '');
        // Native required validation accepts whitespace, so validate after trimming.
        if (!title || !Number.isFinite(amount) || amount < 0 || !isCalendarDate(date)) {
            setHasError(true);
            setFeedback('Please enter a title, a valid amount and a date.');
            return;
        }
        setSaving(true);
        const saved = await onSaveExpenseData({ title, amount, date });
        setSaving(false);
        if (!saved) return;
        form.reset();
        setHasError(false);
        setFeedback(`Added “${title}”.`);
    }}>
        <div className="new-expense__controls">
            <div className="new-expense__control"><label htmlFor="title">Title</label><input id="title" name="title" placeholder="Title" required maxLength={80} autoComplete="off" /></div>
            <div className="new-expense__control"><label htmlFor="amount">Amount <span>USD</span></label><input id="amount" name="amount" type="number" placeholder="Amount" inputMode="decimal" min="0" step="0.01" required /></div>
            <div className="new-expense__control"><label htmlFor="date">Date</label><input id="date" name="date" type="date" min="0001-01-01" max="9999-12-31" defaultValue={localDate} required /></div>
        </div>
        <div className="new-expense__actions"><button type="submit" disabled={saving}>Add Expense <span aria-hidden="true">+</span></button></div>
        <p className={`form-feedback${hasError ? ' form-feedback--error' : ''}`} role="status">{feedback}</p>
    </form>;
};
export default ExpenseForm;
