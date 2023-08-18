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

    const filteredExpenses = expenses.filter(expense => {
        return expense.date.getFullYear().toString() === filteredYear;
      });
    
    return (
        <Card className="expenses">
            <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
            {filteredExpenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />)}
        </Card>
    );
}

export default Expenses;