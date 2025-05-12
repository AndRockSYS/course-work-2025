import type { Metadata } from 'next';
import { Public_Sans } from 'next/font/google';

import QueryProvider from '@/context/QueryProvider';
import StoreProvider from '@/context/StoreProvider';

import './globals.css';

const publicSans = Public_Sans({
    variable: '--font-public-sans',
    subsets: ['latin'],
    weight: ['400', '500', '800'],
});

export const metadata: Metadata = {
    title: 'Залізниця',
    description: 'Курсова 2025 - Залізниця',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <QueryProvider>
                <StoreProvider>
                    <body className={`${publicSans.variable} antialiased`}>{children}</body>
                </StoreProvider>
            </QueryProvider>
        </html>
    );
}
