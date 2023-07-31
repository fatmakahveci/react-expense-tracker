"use client";

import React from 'react';

import ExpenseForm from './ExpenseForm';

import './NewExpense.css';

const NewExpense = () => {
    const saveExpenseDataHandler: Function = (enteredExpenseData: FormData) => {
        const expenseData = {
            ...enteredExpenseData,
            id: Date.now().toString()
        };
        // console.log(expenseData);
    };

    return (
        <div className='new-expense'>
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    )
}

export default NewExpense;