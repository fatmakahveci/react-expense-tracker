"use client";

import React, { useState } from 'react';

import './ExpenseForm.css';

const ExpenseForm = (props: any) => {

    type FormData = {
        title: string,
        amount: number,
        date: string
    }

    const [formData, setFormData] = useState<FormData>({
        title: '',
        amount: 0.0,
        date: new Date().toISOString().slice(0, 10)
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.onSaveExpenseData(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='new-expense__controls'>
                <div className='new-expense__control'>
                    <label>Title<input type="text" onChange={handleChange} name={"title"} /></label>
                </div>
                <div className='new-expense__control'>
                    <label>Amount<input type="number" min="0.01" step="0.01" onChange={handleChange} name={"amount"} /></label>
                </div>
                <div className='new-expense__control'>
                    <label>Date<input type="date" min="2000-01-01" max="2050-01-01" onChange={handleChange} name={"date"} /></label>
                </div>
                <div className='new-expense__actions'>
                    <button type="submit">Add Expense</button>
                </div>
            </div>
        </form>
    );
}

export default ExpenseForm;