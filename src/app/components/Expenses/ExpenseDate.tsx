"use client";

import { FC } from 'react';
import './ExpenseDate.css';

const ExpenseDate: FC<{ date: Date }> = ({ date }): JSX.Element => {

    const month: string = date.toLocaleString('en-US', { month: 'long' });
    const day: string = date.toLocaleString('en-US', { day: '2-digit' });
    const year: number = date.getFullYear();

    return (
        <div className='expense-date'>
            <div className='expense-date__month'>{month}</div>
            <div className='expense-date__year'>{day}</div>
            <div className='expense-date__day'>{year}</div>
        </div>
    );
}

export default ExpenseDate;