'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CarouselChild {
  id: string;
  media_url?: string;
  media_type?: string;
}

interface MediaItem {
  id: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  caption?: string;
  timestamp?: string;
  children?: { data: CarouselChild[] };
}

export function MediaDialog({
  item,
  open,
  onOpenChange,
}: {
  item: MediaItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const children = item?.children?.data ?? [];
  const isCarousel = item?.media_type === 'CAROUSEL_ALBUM';

  const currentUrl = isCarousel
    ? children[carouselIndex]?.media_url
    : item?.media_url;
  const currentType = isCarousel
    ? children[carouselIndex]?.media_type
    : item?.media_type;

  if (!item) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) setCarouselIndex(0);
        onOpenChange(v);
      }}
    >
      <DialogContent className='max-w-lg sm:max-w-lg'>
        <DialogTitle className='sr-only'>Media Details</DialogTitle>

        <div className='space-y-3'>
          {currentType === 'VIDEO' ? (
            <video src={currentUrl} className='w-full rounded-lg' controls />
          ) : (
            <div className='relative aspect-square w-full'>
              <Image
                src={currentUrl || ''}
                alt={item.caption || ''}
                fill
                sizes='(max-width: 640px) 100vw, 512px'
                className='rounded-lg object-cover'
                unoptimized
              />
            </div>
          )}

          {isCarousel && children.length > 1 && (
            <div className='flex items-center justify-center gap-2'>
              <Button
                variant='outline'
                size='xs'
                onClick={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                disabled={carouselIndex === 0}
              >
                Prev
              </Button>
              <span className='text-xs text-muted-foreground'>
                {carouselIndex + 1} / {children.length}
              </span>
              <Button
                variant='outline'
                size='xs'
                onClick={() =>
                  setCarouselIndex((i) => Math.min(children.length - 1, i + 1))
                }
                disabled={carouselIndex === children.length - 1}
              >
                Next
              </Button>
            </div>
          )}

          <div className='space-y-1.5'>
            {item.caption && (
              <p className='text-sm leading-relaxed'>{item.caption}</p>
            )}

            <div className='flex items-center gap-3 text-xs text-muted-foreground'>
              <span className='rounded bg-muted px-2 py-0.5 font-medium'>
                {item.media_type}
              </span>
              {item.timestamp && (
                <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {item.permalink && (
            <Button variant='outline' size='sm' asChild className='w-full'>
              <a
                href={item.permalink}
                target='_blank'
                rel='noopener noreferrer'
              >
                Open in Instagram
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
