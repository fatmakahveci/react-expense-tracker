import { ReactNode } from 'react'
import './globals.css'

export const metadata = { title: 'Expense Tracker | A clearer picture of your spending', description: 'Track everyday expenses, explore your spending and keep your personal finances organized.' };

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
