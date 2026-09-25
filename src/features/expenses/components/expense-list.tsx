"use client";

import { FC } from "react";
import ExpenseItem from "@/features/expenses/components/expense-item";
import { Expense } from "@/features/expenses/types";
import './expense-list.css';

type Props = {
    expenses: Expense[];
    filtered: boolean;
    onReset: () => void;
    onUpdate: (expense: Expense) => void;
    onDelete: (expense: Expense) => void;
}

const ExpenseList: FC<Props> = ({ expenses, onUpdate, onDelete, filtered, onReset }): React.JSX.Element => {
    if (expenses.length === 0) {
        return (
            <div className="expenses-list__fallback">
                <span className="empty-symbol" aria-hidden="true">{filtered ? '⌕' : '+'}</span>
                <h3>{filtered ? 'No matching expenses' : 'Your first expense starts here'}</h3>
                <p>{filtered ? 'Try another title or year to find what you need.' : 'Add an expense to start building your spending picture.'}</p>
                {filtered ? <button onClick={onReset}>Reset filters</button> : <button onClick={() => document.getElementById('title')?.focus()}>Add your first expense</button>}
            </div>
        );
    }
    return (
        <ul className="expenses-list">
            {expenses.map(expense => <ExpenseItem key={expense.id} expense={expense} onUpdate={onUpdate} onDelete={onDelete} />)}
        </ul>
    );
};

export default ExpenseList;
