"use client";

import Link from 'next/link';
import ExpenseOverview from './expense-overview';
import ExpenseEntry from './expense-entry';
import { useExpenses } from '../hooks/use-expenses';
import './expense-dashboard.css';

export default function ExpenseDashboard() {
  const {
    expensesList, notice, removed, addExpenseHandler,
    updateExpense, deleteExpense, undoDeleteExpense, exportExpenses,
  } = useExpenses();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to spending overview</a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Expense Tracker home"><span className="brand-mark">e.</span> expense<span className="brand-light">tracker</span></Link>
        <span className="storage-badge"><span /> Personal workspace</span>
      </header>
      <main id="main-content">
        <div className="page-heading">
          <div><p className="eyebrow">A LITTLE CLARITY, EVERY DAY</p><h1>Your spending, in perspective.</h1><p>Keep track of the little things. Make room for what matters.</p></div>
          <div className="heading-actions">
            <button className="export-button" onClick={exportExpenses}><span aria-hidden="true">↓</span> Export CSV</button>
            <button className="primary-button" onClick={() => {
              const input = document.getElementById('title');
              input?.scrollIntoView({ block: 'center', behavior: 'auto' });
              input?.focus({ preventScroll: true });
            }}><span aria-hidden="true">+</span> New expense</button>
          </div>
        </div>
        {notice && <p className="notice" role="status">{notice}</p>}
        {removed && <div className="notice" role="status"><span>“{removed.title}” deleted.</span><button onClick={undoDeleteExpense} aria-label={`Undo deletion of ${removed.title}`}>Undo</button></div>}
        <div className="workspace">
          <ExpenseOverview expenses={expensesList} onUpdate={updateExpense} onDelete={deleteExpense} />
          <aside className="entry-sidebar" aria-label="Add and manage expenses"><ExpenseEntry onAddExpense={addExpenseHandler} /><div className="workspace-note"><span className="note-symbol" aria-hidden="true">↗</span><h3>Small habits. A clearer picture.</h3><p>Add expenses as you go to see where your money goes over time.</p><p className="local-note">Saved in this browser. Export a copy to keep a backup.</p></div></aside>
        </div>
      </main>
      <footer><span>A little more aware. A little more in control.</span><span>Expense Tracker</span></footer>
    </div>
  )
}
