import React from 'react';

import './ExpenseDate.css';

const ExpenseDate = (date: any) => {
    const month = date.date.toLocaleString('en-US', { month: 'long' });
    const day = date.date.toLocaleString('en-US', { day: '2-digit' });
    const year = date.date.getFullYear();

    return (
        <div className='expense-date'>
            <div className='expense-date__month'>{month}</div>
            <div className='expense-date__year'>{day}</div>
            <div className='expense-date__day'>{year}</div>
        </div>
    );
}

export default ExpenseDate;