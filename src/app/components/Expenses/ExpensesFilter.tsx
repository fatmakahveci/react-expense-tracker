"use client";

import React from "react";
import './ExpensesFilter.css';

type Props = {
    selected: string;
    onChangeFilter: Function;
}

const ExpensesFilter: React.FC<Props> = ({ selected, onChangeFilter }) => {
    const dropdownChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChangeFilter(e.target.value);
    }

    return (
        <div className="expenses-filter">
            <div className="expenses-filter__control">
                <label>Filter by year
                    <select value={selected} onChange={dropdownChangeHandler}>
                        <option value='2023'>2023</option>
                        <option value='2022'>2022</option>
                        <option value='2021'>2021</option>
                        <option value='2020'>2020</option>
                        <option value='2019'>2019</option>
                    </select>
                </label>
            </div>
        </div>
    );
}

export default ExpensesFilter;