import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'Scalo',
    template: '%s · Scalo',
  },
  description: 'Scalo — Unified AI feedback.',
  keywords: ['AI', 'feedback', 'scalo', 'productivity', 'reviews'],
  authors: [{ name: 'Scalo', url: 'https://example.com' }],
  creator: 'Scalo',
  openGraph: {
    title: 'Scalo',
    description: 'Unified AI feedback for teams and products.',
    type: 'website',
    url: 'https://example.com',
  },
};

export const viewport: Viewport = {
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
