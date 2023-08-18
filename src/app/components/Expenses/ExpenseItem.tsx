import React from 'react';

import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';

import './ExpenseItem.css';

import { Expense } from '../../../shared/types/Types';

const ExpenseItem: React.FC<{expense: Expense}> = ({expense}): JSX.Element => {

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