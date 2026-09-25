"use client";

import { FC, useState } from 'react';
import Card from '@/components/ui/card';
import ExpenseDate from '@/features/expenses/components/expense-date';
import './expense-item.css';
import { Expense } from '@/features/expenses/types';

const ExpenseItem: FC<{ expense: Expense; onUpdate: (expense: Expense) => void; onDelete: (expense: Expense) => void }> = ({ expense, onUpdate, onDelete }): React.JSX.Element => {
    const [editing, setEditing] = useState(false);
    if (editing) return <li><form className="expense-edit" onSubmit={event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const title = String(data.get('title') || '').trim();
        const amount = Number(data.get('amount'));
        // Use the same local-calendar parsing as the creation form.
        const date = new Date(String(data.get('date')) + 'T00:00:00');
        if (!title || !Number.isFinite(amount) || amount < 0 || !Number.isFinite(date.getTime())) return;
        onUpdate({ ...expense, title, amount, date });
        setEditing(false);
    }}>
        <h3>Edit expense</h3>
        <label>Title<input autoFocus name="title" defaultValue={expense.title} required maxLength={80} /></label>
        <label>Amount<input name="amount" type="number" min="0" step="0.01" defaultValue={expense.amount} required /></label>
        <label>Date<input name="date" type="date" defaultValue={`${expense.date.getFullYear()}-${String(expense.date.getMonth()+1).padStart(2,'0')}-${String(expense.date.getDate()).padStart(2,'0')}`} required /></label>
        <div className="edit-actions"><button className="primary-button" type="submit">Save changes</button><button type="button" onClick={() => setEditing(false)}>Cancel</button></div>
    </form></li>;

    return (
        <li><Card className='expense-item'>
            <ExpenseDate date={expense.date} />
            <div className='expense-item__description'>
                <h2>{expense.title}</h2>
                <div className='expense-item__price'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}</div>
            </div>
            <div className="expense-item__actions"><button onClick={() => setEditing(true)} aria-label={`Edit ${expense.title}`}>Edit</button>
            <button onClick={() => onDelete(expense)} aria-label={`Delete ${expense.title}`}>Delete</button></div>
        </Card></li>
    );
}

export default ExpenseItem;
