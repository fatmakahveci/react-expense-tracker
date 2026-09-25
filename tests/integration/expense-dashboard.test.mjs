import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the expense dashboard connects expense creation to the expense list", async () => {
  const page = await readFile("src/features/expenses/components/expense-dashboard.tsx", "utf8");

  assert.match(page, /<ExpenseEntry onAddExpense=\{addExpenseHandler\}/);
  assert.match(page, /<ExpenseOverview expenses=\{expensesList\}/);
});

test("the expense form captures title, amount, and date", async () => {
  const form = await readFile("src/features/expenses/components/expense-form.tsx", "utf8");

  for (const field of ["title", "amount", "date"]) {
    assert.match(form, new RegExp(field, "i"));
  }
  assert.match(form, /onSaveExpenseData/);
});
