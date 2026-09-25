"use client";

import { FC } from 'react';
import ExpenseForm from '@/features/expenses/components/expense-form';
import './expense-entry.css';
import { Expense } from '@/features/expenses/types';

type Props = {
    onAddExpense: (expense: Expense) => void;
}

const ExpenseEntry: FC<Props> = ({ onAddExpense }): React.JSX.Element => {
    const saveExpenseDataHandler = (enteredExpense: Omit<Expense, 'id'>) => {
        const expense = {
            ...enteredExpense,
            id: crypto.randomUUID()
        };
        onAddExpense(expense);
    };

    return (
        <div className='new-expense'>
            <div className="form-heading"><span className="add-symbol" aria-hidden="true">+</span><h2>Add an expense</h2><p>A quick entry. One less thing on your mind.</p></div>
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    )
}

export default ExpenseEntry;
