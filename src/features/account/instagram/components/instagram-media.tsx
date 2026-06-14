'use client';

import { useEffect, useState } from 'react';
import { getInstagramMedia } from '../actions';
import { MediaGridSkeleton } from './media-grid-skeleton';
import { MediaDialog } from './media-dialog';
import Image from 'next/image';

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

export function InstagramMedia() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<MediaItem | null>(null);

    useEffect(() => {
        getInstagramMedia()
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setMedia(data.data ?? []);
                }
            })
            .catch(() => setError('Failed to load media'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <MediaGridSkeleton />;
    }

    if (error) {
        return <div className="text-sm text-red-500">{error}</div>;
    }

    if (media.length === 0) {
        return <div className="text-sm text-muted-foreground">No media found.</div>;
    }

    function thumbUrl(item: MediaItem) {
        if (item.media_url) return item.media_url;
        if (item.media_type === 'CAROUSEL_ALBUM' && item.children?.data?.[0]) {
            return item.children.data[0].media_url;
        }
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {media.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className="group relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-pointer text-left"
                    >
                        {item.media_type === 'VIDEO' ? (
                            <video
                                src={item.media_url}
                                className="h-full w-full object-cover"
                                muted
                            />
                        ) : (
                            <Image
                                src={thumbUrl(item) ?? ''}
                                alt={item.caption || ''}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                className="object-cover transition-transform group-hover:scale-105"
                                loading="lazy"
                                unoptimized
                            />
                        )}
                        <span className="absolute top-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                            {item.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : item.media_type}
                        </span>
                        {item.media_type === 'CAROUSEL_ALBUM' && item.children?.data && (
                            <span className="absolute top-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white flex items-center gap-1">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="2" y="2" width="20" height="20" rx="2"/>
                                    <line x1="8" y1="2" x2="8" y2="22"/>
                                    <line x1="16" y1="2" x2="16" y2="22"/>
                                    <line x1="2" y1="8" x2="22" y2="8"/>
                                    <line x1="2" y1="16" x2="22" y2="16"/>
                                </svg>
                                {item.children.data.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <MediaDialog
                item={selected}
                open={!!selected}
                onOpenChange={(open) => { if (!open) setSelected(null); }}
            />
        </>
    );
}
