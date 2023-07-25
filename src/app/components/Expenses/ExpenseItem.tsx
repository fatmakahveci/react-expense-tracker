import React, { useState, FC } from 'react';

import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';

import './ExpenseItem.css';

interface Expense {
    id: string;
    title: string;
    amount: number;
    date: Date;
}

const ExpenseItem = (expense: Expense) => {
    const [title, setTitle] = useState(expense.title);

    const clickHandler = () => {
        setTitle('Updated!');
    };

    return (
        <Card className='expense-item'>
            <ExpenseDate date={expense.date} />
            <div className='expense-item__description'>
                <h2>{title}</h2>
                <div className='expense-item__price'>${expense.amount}</div>
            </div>
            <button onClick={clickHandler}>Change Title</button>
        </Card>
    );
}

export default ExpenseItem;