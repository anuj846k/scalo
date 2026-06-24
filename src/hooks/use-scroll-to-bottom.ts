'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isAtBottomRef = useRef(true);
  const isUserScrollingRef = useRef(false);
  const isStreamingRef = useRef(false);

  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    const threshold = 100;
    const atBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - threshold;
    isAtBottomRef.current = atBottom;
    setIsAtBottom(atBottom);
    return atBottom;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'instant') => {
    const container = containerRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior });
    });
  }, []);

  const reset = useCallback(() => {
    setIsAtBottom(true);
    isAtBottomRef.current = true;
    isUserScrollingRef.current = false;
    scrollToBottom('instant');
  }, [scrollToBottom]);

  const setStreaming = useCallback((s: boolean) => {
    isStreamingRef.current = s;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      isUserScrollingRef.current = true;
      checkIfAtBottom();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };

    const observer = new MutationObserver(() => {
      if (isAtBottomRef.current && !isUserScrollingRef.current) {
        scrollToBottom('instant');
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      if (
        isAtBottomRef.current &&
        !isUserScrollingRef.current &&
        isStreamingRef.current
      ) {
        scrollToBottom('instant');
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    resizeObserver.observe(container);
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, [checkIfAtBottom, scrollToBottom]);

  return {
    containerRef,
    endRef,
    isAtBottom,
    scrollToBottom,
    reset,
    setStreaming,
  };
}
