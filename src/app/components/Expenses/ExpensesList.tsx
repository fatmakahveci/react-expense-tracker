"use client";

import React from "react";
import ExpenseItem from "./ExpenseItem";
import { Expense } from "@/shared/types/Types";
import './ExpensesList.css';

type Props = {
    expenses: Expense[];
}

const ExpensesList: React.FC<Props> = ({ expenses }): JSX.Element => {
    if (expenses.length === 0) {
        return (
            <h2 className="expenses-list__fallback">No expenses found.</h2>
        );
    }
    return (
        <ul className="expenses-list">
            {expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />)}
        </ul>
    );
};

export default ExpensesList;