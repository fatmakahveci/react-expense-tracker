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
};

const Expenses: FC<Props> = ({ expenses }): JSX.Element => {
    const [filteredYear, setFilteredYear] = useState<string>('2020');

    const filterChangeHandler: Function = (selected: string) => {
        setFilteredYear(selected);
    };

    const filteredExpenses: Expense[] = expenses.filter(expense => {
        return expense.date.getFullYear().toString() === filteredYear;
    });

    return (
        <Card className="expenses">
            <ExpensesFilter selected={filteredYear} onChangeFilter={filterChangeHandler} />
            <ExpensesChart expenses={filteredExpenses} />
            <ExpensesList expenses={filteredExpenses} />
        </Card>
    );
}

export default Expenses;