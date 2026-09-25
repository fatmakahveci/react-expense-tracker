import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
const source = readFileSync('src/features/expenses/lib/expense-storage.ts', 'utf8');
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

const validRow = { id: 'valid', title: 'Lunch', amount: 12.5, date: '2026-03-01T12:00:00Z' };
for (const [name, patch] of [
  ['missing identifier', { id: undefined }],
  ['numeric identifier', { id: 12 }],
  ['blank title', { title: '  ' }],
  ['non-string title', { title: 12 }],
  ['negative amount', { amount: -0.01 }],
  ['string amount', { amount: '12.50' }],
  ['null amount', { amount: null }],
  ['invalid date', { date: 'not-a-date' }],
  ['numeric date', { date: 123 }],
]) {
  test(`saved expenses reject ${name}`, () => {
    assert.throws(() => restoreExpenses(JSON.stringify([{ ...validRow, ...patch }])), /Invalid saved expense/);
  });
}

test('restoration rejects a whole collection when a later record is invalid', () => {
  assert.throws(() => restoreExpenses(JSON.stringify([validRow, { ...validRow, id: 'bad', title: '' }])));
});

test('restoration accepts zero and preserves cent precision', () => {
  const rows = restoreExpenses(JSON.stringify([
    { ...validRow, id: 'zero', amount: 0 },
    { ...validRow, id: 'cents', amount: 999.99 },
  ]));
  assert.deepEqual(rows.map(row => row.amount), [0, 999.99]);
});

for (const title of ['=1+1', '+SUM(A1)', '-1+1', '@SUM(A1)', '  =1+1', '\tSUM(A1)', '\rSUM(A1)', '\nSUM(A1)']) {
  test(`CSV neutralizes formula prefix ${JSON.stringify(title)}`, () => {
    const output = expensesCsv([{ ...validRow, title, date: new Date(2026, 0, 2) }]);
    assert.equal(output, `Title,Amount,Date\r\n"'${title}","12.50","2026-01-02"\r\n`);
  });
}

test('CSV preserves quoted, multiline and Unicode titles and local calendar dates', () => {
  const output = expensesCsv([{ ...validRow, title: 'Öğle, "yemek"\nİstanbul', date: new Date(2026, 0, 2, 23, 59) }]);
  assert.equal(output, 'Title,Amount,Date\r\n"Öğle, ""yemek""\nİstanbul","12.50","2026-01-02"\r\n');
});

test('CSV exports an empty collection as a header only', () => {
  assert.equal(expensesCsv([]), 'Title,Amount,Date\r\n');
});

for (const title of ['＝1+1', '＋SUM(A1)', '－1+1', '＠SUM(A1)', '  ＝1+1', ' \tSUM(A1)', '\u0000=1+1', '\u007f=1+1']) {
  test(`CSV protects compatibility characters and controls: ${JSON.stringify(title)}`, () => {
    const output = expensesCsv([{ ...validRow, title, date: new Date(2026, 0, 2) }]);
    assert.equal(output, `Title,Amount,Date\r\n"'${title}","12.50","2026-01-02"\r\n`);
  });
}
