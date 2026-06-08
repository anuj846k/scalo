import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Elms_Sans } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const elmsSans = Elms_Sans({
  subsets: ['latin'],
  variable: '--font-elms-sans',
});

export const metadata: Metadata = {
  title: 'Scalo',
  description: 'Scalo — global transfers, simplified.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${elmsSans.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
