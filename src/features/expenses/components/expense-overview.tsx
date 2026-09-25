"use client";

import { FC, useState } from 'react';
import './expense-overview.css';
import Card from '@/components/ui/card';
import ExpenseYearFilter from '@/features/expenses/components/expense-year-filter';
import { Expense } from '@/features/expenses/types';
import ExpenseList from '@/features/expenses/components/expense-list';
import ExpenseChart from '@/features/expenses/components/expense-chart';

type Props = {
    expenses: Expense[];
    onUpdate: (expense: Expense, original: Expense) => Promise<boolean>;
    onDelete: (expense: Expense) => void;
};

const ExpenseOverview: FC<Props> = ({ expenses, onUpdate, onDelete }): React.JSX.Element => {
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('newest');
    const [filteredYear, setFilteredYear] = useState<string>('all');

    const filterChangeHandler = (selected: string) => {
        setFilteredYear(selected);
    };

    // Keep the selected year available even after its last expense is deleted.
    const years = Array.from(new Set([...expenses.map(expense => Number(expense.date.slice(0, 4))), ...(filteredYear === 'all' ? [] : [Number(filteredYear)])])).sort((a, b) => b - a);
    const hasFilters = Boolean(query) || filteredYear !== 'all';
    const clearFilters = () => { setQuery(''); setFilteredYear('all'); };

    const filteredExpenses: Expense[] = expenses.filter(expense => {
        return filteredYear === 'all' || expense.date.slice(0, 4) === filteredYear;
    });

    // The year controls summaries and chart data; text search only narrows the list.
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const visibleExpenses = filteredExpenses.filter(expense => expense.title.toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === 'highest' ? b.amount - a.amount : b.date.localeCompare(a.date));

    return (
        <Card className="expenses">
            <div className="section-heading"><div><h2>Overview</h2><p className="section-description">A closer look at your everyday spending.</p></div><ExpenseYearFilter selected={filteredYear} onChangeFilter={filterChangeHandler} years={years} /></div>
            <div className="summary-grid">
                <div className="summary-card summary-primary"><span>Total spent</span><strong>{money(total)}</strong><small>{filteredYear === 'all' ? 'Across all years' : `In ${filteredYear}`}</small></div>
                <div className="summary-card"><span>Transactions</span><strong>{filteredExpenses.length}</strong><small>Expenses recorded</small></div>
                <div className="summary-card"><span>Average expense</span><strong>{money(filteredExpenses.length ? total / filteredExpenses.length : 0)}</strong><small>Per transaction</small></div>
            </div>
            <section className="chart-panel"><div className="panel-heading"><h3>Monthly spending</h3><span>{filteredYear === 'all' ? 'All years combined' : filteredYear}</span></div>
            <ExpenseChart expenses={filteredExpenses} /></section>
            <section className="transactions-panel"><div className="panel-heading"><h3>Transactions <span className="count-badge">{visibleExpenses.length}</span></h3><label className="sort-label">Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="newest">Newest first</option><option value="highest">Highest amount</option></select></label></div>
            <div className="search-control"><span className="search-symbol" aria-hidden="true">⌕</span><input className="search-input" aria-label="Search expenses" placeholder="Search your expenses…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}>×</button>}</div>
            {hasFilters && <div className="filter-summary"><span role="status">{visibleExpenses.length} {visibleExpenses.length === 1 ? 'expense' : 'expenses'} found{filteredYear !== 'all' ? ` in ${filteredYear}` : ''}</span><button onClick={clearFilters}>Reset filters</button></div>}
            <ExpenseList expenses={visibleExpenses} onUpdate={onUpdate} onDelete={onDelete} filtered={hasFilters} onReset={clearFilters} /></section>
        </Card>
    );
}

export default ExpenseOverview;
