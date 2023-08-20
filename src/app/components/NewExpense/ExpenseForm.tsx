"use client";

import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './ExpenseForm.css';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface FormModel {
    title: string,
    amount: number,
    date: Date | undefined
}

const ExpenseForm = (props: any): any => {
    const FormSchema = Yup.object({
        title: Yup.string()
            .min(2, 'Too short!')
            .max(30, 'Too long!')
            .required('required'),
        amount: Yup.number()
            .min(0.0)
            .max(500.0)
            .required('required'),
        date: Yup.date()
            .nonNullable()
            .min(new Date(2020, 1, 1))
            .max(new Date())
            .required('required')
    });

    return (
        <Formik<FormModel>
            initialValues={{
                title: '',
                amount: 0.0,
                date: new Date()
            }}
            onSubmit={(values: FormModel) => {
                props.onSaveExpenseData(values);
            }}
            validationSchema={FormSchema}
        >
            {({ handleSubmit, errors, values, handleChange, setFieldValue }) => {
                let dateOnChange = (date: Date | null) => {
                    setFieldValue("date", date);
                }
                return (
                    <form onSubmit={handleSubmit}>
                        <div className='new-expense__controls'>
                            <div className='new-expense__control'>
                                <label htmlFor='title'>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Title"
                                    value={values.title}
                                    onChange={handleChange}
                                />
                                {errors.title ? (
                                    <div className="error">
                                        {errors.title}
                                    </div>
                                ) : null}
                            </div>
                            <div className='new-expense__control'>
                                <label htmlFor='amount'>Amount</label>
                                <input
                                    type="number"
                                    min="0.0"
                                    step="0.1"
                                    name="amount"
                                    placeholder="Amount"
                                    value={values.amount}
                                    onChange={handleChange}
                                />
                                {errors.amount ? (
                                    <div className="error">
                                        {errors.amount}
                                    </div>
                                ) : null}
                            </div>
                            <div className='new-expense__control'>
                                <label htmlFor='date'>Date</label>
                                <DatePicker
                                    name="date"
                                    placeholderText='Date'
                                    value={values.date?.toLocaleDateString()}
                                    selected={values.date}
                                    onChange={dateOnChange}
                                />
                                {errors.date ? (
                                    <div className="error">
                                        {errors.date}
                                    </div>
                                ) : null}
                            </div>
                            <div className='new-expense__actions'>
                                <button type="submit">Add Expense</button>
                            </div>
                        </div>
                    </form>
                )
            }}
        </Formik>
    );
}

export default ExpenseForm;