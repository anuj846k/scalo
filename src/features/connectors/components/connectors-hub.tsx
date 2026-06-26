'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const connectors = [
  {
    title: 'CSV Upload',
    description:
      'Upload feedback data from a CSV file. Map columns and ingest reviews in bulk.',
    href: '/dashboard/connectors/upload',
    logo: '/logos/csv.svg',
    available: true,
  },
  {
    title: 'Google Reviews',
    description: 'Pull reviews from a Google Business listing via Place ID.',
    href: '/dashboard/connectors/google-reviews',
    logo: '/logos/google.svg',
    available: true,
  },
  {
    title: 'Instagram',
    description: 'Import comments from Instagram posts via HikerAPI.',
    href: '#',
    logo: '/logos/instagram.svg',
    available: false,
  },
  {
    title: 'Zendesk',
    description: 'Pull support tickets from your Zendesk workspace.',
    href: '#',
    logo: '/logos/zendesk.svg',
    available: false,
  },
];

export default function ConnectorsHub() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 md:px-8">
      <div className="max-w-md">
        <h1 className="text-xl font-extrabold sm:text-2xl">Connectors</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a source to import feedback from.
        </p>
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2">
        {connectors.map((item) => (
          <li
            key={item.title}
            className={cn(
              'rounded-xl border border-border/40 bg-card transition-shadow hover:shadow-sm',
              !item.available && 'opacity-40 pointer-events-none',
            )}
          >
            <div className="flex items-start justify-between p-5">
              <div className="space-y-3">
                <Image
                  src={item.logo}
                  alt={item.title}
                  width={40}
                  height={40}
                  className="size-10 rounded-xl"
                />
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  {!item.available && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground/70">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="border-t border-border/40 px-5 py-3 text-right">
              {item.available ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                  Configure
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground/40">
                  Coming soon
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
