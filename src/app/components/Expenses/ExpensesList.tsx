"use client";

import React from "react";
import ExpenseItem from "./ExpenseItem";
import { Expense } from "@/shared/types/Types";

type Props = {
    expenses: Expense[];
}

const ExpensesList: React.FC<Props> = ({ expenses }) => {
    {
        expenses.length === 0 ?
            (
                <p>No expenses found.</p>
            ) : (
                expenses.map((expense: Expense) => <ExpenseItem key={expense.id} expense={expense} />)
            )
    }

    return (
        <ul></ul>
    );
};

export default ExpensesList;