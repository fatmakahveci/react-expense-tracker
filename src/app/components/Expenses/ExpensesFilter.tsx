"use client";

import { ChangeEvent, FC } from "react";
import './ExpensesFilter.css';

type Props = {
    selected: string;
    onChangeFilter: Function;
    years: number[];
}

const ExpensesFilter: FC<Props> = ({ selected, onChangeFilter, years }): JSX.Element => {
    const dropdownChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
        onChangeFilter(e.target.value);
    }

    return (
        <div className="expenses-filter">
            <div className="expenses-filter__control">
                <label>Filter by year
                    <select value={selected} onChange={dropdownChangeHandler}>
                        <option value="all">All years</option>
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </label>
            </div>
        </div>
    );
}

export default ExpensesFilter;
