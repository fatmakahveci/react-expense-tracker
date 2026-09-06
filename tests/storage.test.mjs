import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
const source = readFileSync('src/shared/expenseStorage.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const { restoreExpenses, expensesCsv } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

test('persistence restores real Date objects and preserves empty collections', () => {
  const restored = restoreExpenses(JSON.stringify([{ id: '1', title: 'Book', amount: 12.5, date: '2026-01-02T12:00:00Z' }]));
  assert.ok(restored[0].date instanceof Date);
  assert.equal(restored[0].amount, 12.5);
  assert.deepEqual(restoreExpenses('[]'), []);
});
test('malformed data and duplicate identifiers are rejected', () => {
  for (const input of ['invalid', '{}', '[null]', '[{"id":"1","title":"Book","amount":-1,"date":"bad"}]']) assert.throws(() => restoreExpenses(input));
  const row = { id: '1', title: 'Book', amount: 12, date: '2026-01-02' };
  assert.throws(() => restoreExpenses(JSON.stringify([row, row])));
});
test('CSV quotes content and neutralizes spreadsheet formulas', () => {
  const output = expensesCsv([{ title: '=SUM(1,2)', amount: 3.5, date: new Date(2026,0,2) }, { title: 'A "book"', amount: 1, date: new Date(2026,0,2) }]);
  assert.ok(output.includes('"\'=SUM(1,2)"'));
  assert.ok(output.includes('"A ""book"""'));
  assert.ok(output.includes('"3.50","2026-01-02"'));
});
