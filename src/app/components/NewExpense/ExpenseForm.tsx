"use client";

import React, { useState } from 'react';

import './ExpenseForm.css';

const ExpenseForm = () => {

    const [enteredTitle, setEnteredTitle] = useState('');

    const titleChangeHandler = (e: React.SyntheticEvent) => {
        const target = e.target as typeof e.target & {
            title: { value: string };
        };
        setEnteredTitle(target.title.value);
    };

    return (
        <form>
            <div className='new-expense__controls'>
                <div className='new-expense__control'>
                    <label>Title<input type="text" onChange={titleChangeHandler}/></label>
                </div>
                <div className='new-expense__control'>
                    <label>Amount<input type="number" min="0.01" step="0.01" /></label>
                </div>
                <div className='new-expense__control'>
                    <label>Date<input type="date" min="2019-01-01" max="2022-12-31" /></label>
                </div>
                <div className='new-expense__actions'>
                    <button type="submit">Add Expense</button>
                </div>
            </div>
        </form>
    );
}

export default ExpenseForm;