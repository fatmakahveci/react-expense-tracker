"use client";

import React, { useState } from 'react';

import ExpenseItem from './ExpenseItem';

import './Expenses.css';
import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';

import { ExpenseListProps } from '../../../shared/types/Types';

const Expenses: React.FC<ExpenseListProps> = ({ expenses }): JSX.Element => {
    const [filteredYear, setFilteredYear] = useState<string>('2020');

    const filterChangeHandler: Function = (selectedYear: string) => {
        setFilteredYear(selectedYear);
    };
    
    return (
        <Card className="expenses">
            <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
            {expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />)}
        </Card>
    );
}

export default Expenses;