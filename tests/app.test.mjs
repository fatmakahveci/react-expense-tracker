import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the home page connects expense creation to the expense list", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /<NewExpense onAddExpense=\{addExpenseHandler\}/);
  assert.match(page, /setExpensesList\(prevExpenses/);
  assert.match(page, /\[expense, \.\.\.prevExpenses\]/);
  assert.match(page, /<Expenses expenses=\{expensesList\}/);
});

test("the expense form captures title, amount, and date", async () => {
  const form = await readFile("src/app/components/NewExpense/ExpenseForm.tsx", "utf8");

  for (const field of ["title", "amount", "date"]) {
    assert.match(form, new RegExp(field, "i"));
  }
  assert.match(form, /onSaveExpenseData/);
});
