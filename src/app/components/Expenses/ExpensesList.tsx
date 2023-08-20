"use client";

import React from "react";
import ExpenseItem from "./ExpenseItem";
import { Expense } from "@/shared/types/Types";

type Props = {
    expenses: Expense[];
}

const ExpensesList: React.FC<Props> = ({ expenses }) => {

    return (
        <ul className="expenses-list">
            {
                expenses.length === 0 ?
                    (
                        <p>No expenses found.</p>
                    ) : (
                        expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} />)
                    )
            }
        </ul>
    );
};

export default ExpensesList;