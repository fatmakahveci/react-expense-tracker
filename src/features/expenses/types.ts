export interface Expense {
    id: string;
    title: string;
    amount: number;
    // A calendar date, not an instant: YYYY-MM-DD.
    date: string;
}
