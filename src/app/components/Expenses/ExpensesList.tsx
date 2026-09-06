"use client";

import { FC } from "react";
import ExpenseItem from "./ExpenseItem";
import { Expense } from "@/shared/types/Types";
import './ExpensesList.css';

type Props = {
    expenses: Expense[];
    onUpdate: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
}

const ExpensesList: FC<Props> = ({ expenses, onUpdate, onDelete }): JSX.Element => {
    if (expenses.length === 0) {
        return (
            <h2 className="expenses-list__fallback">No expenses found.</h2>
        );
    }
    return (
        <ul className="expenses-list">
            {expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} onUpdate={onUpdate} onDelete={onDelete} />)}
        </ul>
    );
};

export default ExpensesList;
