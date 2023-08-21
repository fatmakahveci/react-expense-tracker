"use client";

import React from 'react';
import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

type Props = {
    onAddExpense: Function;
}

const NewExpense: React.FC<Props> = ({ onAddExpense }): JSX.Element => {
    const saveExpenseDataHandler: Function = (enteredExpense: FormData) => {
        const expense = {
            ...enteredExpense,
            id: Date.now().toString()
        };
        onAddExpense(expense);
    };

    return (
        <div className='new-expense'>
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    )
}

export default NewExpense;