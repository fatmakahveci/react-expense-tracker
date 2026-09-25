"use client";

import { FC, useState } from 'react';
import Card from '@/components/ui/card';
import ExpenseDate from '@/features/expenses/components/expense-date';
import './expense-item.css';
import { isCalendarDate } from '../lib/expense-storage';
import { Expense } from '@/features/expenses/types';

const ExpenseItem: FC<{ expense: Expense; onUpdate: (expense: Expense, original: Expense) => Promise<boolean>; onDelete: (expense: Expense) => void }> = ({ expense, onUpdate, onDelete }): React.JSX.Element => {
    const [editing, setEditing] = useState<Expense | null>(null);
    const [saving, setSaving] = useState(false);
    if (editing) return <li><form className="expense-edit" onSubmit={async event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = String(data.get('title') || '').trim();
        const amount = Number(data.get('amount'));
        const date = String(data.get('date') || '');
        if (!title || !Number.isFinite(amount) || amount < 0 || !isCalendarDate(date)) return;
        setSaving(true);
        const saved = await onUpdate({ ...editing, title, amount, date }, editing);
        setSaving(false);
        if (saved) setEditing(null);
    }}>
        <h3>Edit expense</h3>
        <label>Title<input autoFocus name="title" defaultValue={editing.title} required maxLength={80} /></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" defaultValue={editing.amount} required /></label>
        <label>Date<input name="date" type="date" min="0001-01-01" max="9999-12-31" defaultValue={editing.date} required /></label>
        <div className="edit-actions"><button className="primary-button" type="submit" disabled={saving}>Save changes</button><button type="button" disabled={saving} onClick={() => setEditing(null)}>Cancel</button></div>
    </form></li>;

    return (
        <li><Card className='expense-item'>
            <ExpenseDate date={expense.date} />
            <div className='expense-item__description'>
                <h2>{expense.title}</h2>
                <div className='expense-item__price'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}</div>
            </div>
            <div className="expense-item__actions"><button onClick={() => setEditing({ ...expense })} aria-label={`Edit ${expense.title}`}>Edit</button>
            <button onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`}>Delete</button></div>
        </Card></li>
    );
}

export default ExpenseItem;
