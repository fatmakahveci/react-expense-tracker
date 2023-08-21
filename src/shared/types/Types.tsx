export interface Expense {
    id?: string;
    title: string;
    amount: number;
    date: Date;
}

export interface DataPoint {
    label: string;
    value: number;
}
