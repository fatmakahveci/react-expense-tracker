"use client";

import { FC, useState } from 'react';
import './Expenses.css';
import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';
import { Expense } from '../../../shared/types/Types';
import ExpensesList from './ExpensesList';
import ExpensesChart from './ExpensesChart';

type Props = {
    expenses: Expense[];
    onUpdate: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
};

const Expenses: FC<Props> = ({ expenses, onUpdate, onDelete }): JSX.Element => {
    const [filteredYear, setFilteredYear] = useState<string>('all');

    const filterChangeHandler: Function = (selected: string) => {
        setFilteredYear(selected);
    };

    const filteredExpenses: Expense[] = expenses.filter(expense => {
        return filteredYear === 'all' || expense.date.getFullYear().toString() === filteredYear;
    });

    return (
        <Card className="expenses">
            <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler} years={Array.from(new Set(expenses.map(expense => expense.date.getFullYear()))).sort((a, b) => b - a)} />
            <ExpensesChart expenses={filteredExpenses} />
            <ExpensesList expenses={filteredExpenses} onUpdate={onUpdate} onDelete={onDelete} />
        </Card>
    );
}

export default Expenses;
