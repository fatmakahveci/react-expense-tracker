# Expense Tracker

[![Next.js](https://img.shields.io/badge/Next.js-React-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Last commit](https://img.shields.io/github/last-commit/fatmakahveci/react-expense-tracker)](https://github.com/fatmakahveci/react-expense-tracker/commits/main)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE.md)

A type-safe expense tracking interface built with Next.js. Add expenses, filter them by year, and review spending through a responsive chart.

## Highlights

- Create expenses with a title, amount, and date
- Filter the expense list by year
- Visualize monthly spending with reusable chart components
- Keep UI state and domain models typed with TypeScript

## Technology

- Next.js
- React
- TypeScript
- Formik
- Yup
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Quality Checks

```bash
npm run lint
npm run build
```

## Repository Structure

- `src/app/components/Expenses` — expense list, filtering, and chart integration
- `src/app/components/NewExpense` — expense creation form
- `src/app/components/Chart` — reusable visualization components

## Project Resources

- [Changelog](CHANGELOG.md)
- [Contributing guide](.github/CONTRIBUTING.md)
- [Security policy](.github/SECURITY.md)
- [License](LICENSE.md)
