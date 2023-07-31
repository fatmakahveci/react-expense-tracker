"use client";

import React from 'react';

import ExpenseForm from './ExpenseForm';

import './NewExpense.css';

const NewExpense = (props: any) => {
    const saveExpenseDataHandler: Function = (enteredExpenseData: FormData) => {
        const expenseData = {
            ...enteredExpenseData,
            id: Date.now().toString()
        };
        props.onAddExpense(expenseData);
        // console.log(expenseData);
    };

    return (
        <div className='new-expense'>
            <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} />
        </div>
    )
}

export default NewExpense;