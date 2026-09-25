"use client";

import { FC } from 'react';
import './expense-date.css';

const ExpenseDate: FC<{ date: string }> = ({ date }): React.JSX.Element => {

    const month: string = new Date(date + 'T12:00:00Z').toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const day: string = date.slice(8, 10);
    const year = date.slice(0, 4);

    return (
        <div className='expense-date'>
            <div className='expense-date__month'>{month}</div>
            <div className='expense-date__day'>{day}</div>
            <div className='expense-date__year'>{year}</div>
        </div>
    );
}

export default ExpenseDate;