'use client';

import ChatPage from '@/features/chat/components/chat-page';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-m-6 h-[calc(100%+3rem)] overflow-hidden">
      <ChatPage />
      {children}
    </div>
  );
}
