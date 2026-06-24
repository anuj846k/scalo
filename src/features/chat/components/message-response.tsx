import { memo } from 'react';
import { Streamdown } from 'streamdown';

export const MessageResponse = memo(
  ({ children }: { children: string }) => (
    <Streamdown className="prose prose-sm dark:prose-invert max-w-none">
      {children}
    </Streamdown>
  ),
  (prev, next) => prev.children === next.children,
);
