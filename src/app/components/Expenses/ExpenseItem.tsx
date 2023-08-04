import React, { useState, FC } from 'react';

import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';

import './ExpenseItem.css';

import { Expense } from '../../../shared/types/Types';

const ExpenseItem = (expense: Expense) => {
    return (
        <Card className='expense-item'>
            <ExpenseDate date={expense.date} />
            <div className='expense-item__description'>
                <h2>{expense.title}</h2>
                <div className='expense-item__price'>${expense.amount}</div>
            </div>
        </Card>
    );
}

export default ExpenseItem;