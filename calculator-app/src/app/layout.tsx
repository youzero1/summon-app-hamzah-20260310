import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Calculator App',
  description: 'A fullstack calculator built with Next.js, TypeScript, and SQLite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
