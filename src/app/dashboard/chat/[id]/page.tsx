import ChatPage from '@/features/chat/components/chat-page';

export default async function ChatDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ChatPage chatId={id} />;
}
