"use client";

import { FC } from 'react';
import './expense-date.css';

const ExpenseDate: FC<{ date: Date }> = ({ date }): React.JSX.Element => {

    const month: string = date.toLocaleString('en-US', { month: 'short' });
    const day: string = date.toLocaleString('en-US', { day: '2-digit' });
    const year: number = date.getFullYear();

    return (
        <div className='expense-date'>
            <div className='expense-date__month'>{month}</div>
            <div className='expense-date__day'>{day}</div>
            <div className='expense-date__year'>{year}</div>
        </div>
    );
}

export default ExpenseDate;