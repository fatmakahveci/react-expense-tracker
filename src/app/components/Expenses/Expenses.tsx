"use client";

import React, { useState } from 'react';

import ExpenseItem from './ExpenseItem';

import './Expenses.css';
import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';

import { Expense } from '../../../shared/types/Types';

interface ExpensesProps {
    items: Expense[];
  }  

const Expenses: React.FC<ExpensesProps> = (expenses) => {
    const [ filteredYear, setFilteredYear ] = useState<string>('2020');

    const filterChangeHandler: Function = (selectedYear: string) => {
        setFilteredYear(selectedYear);
    };

    return (
        <Card className="expenses">
            <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler}/>
            {expenses.items.map((expense) => <ExpenseItem {...expense}/>)}
        </Card>
    );
}

export default Expenses;