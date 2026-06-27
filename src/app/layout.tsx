import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'Murmur',
    template: '%s · Murmur',
  },
  description: 'Murmur — Unified AI feedback.',
  keywords: ['AI', 'feedback', 'murmur', 'productivity', 'reviews'],
  authors: [{ name: 'Murmur', url: 'https://example.com' }],
  creator: 'Murmur',
  openGraph: {
    title: 'Murmur',
    description: 'Unified AI feedback for teams and products.',
    type: 'website',
    url: 'https://example.com',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              '!bg-card !text-foreground !border !border-border/50 !shadow-sm',
          }}
        />
      </body>
    </html>
  );
}
