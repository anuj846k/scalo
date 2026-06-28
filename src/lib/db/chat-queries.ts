import { db } from '@/db/drizzle';
import { chats, messages } from '@/db/schema';
import { and, asc, desc, eq, lt, sql } from 'drizzle-orm';

export async function createChat({
  id,
  title,
  userId,
  organizationId,
}: {
  id: string;
  title: string;
  userId: string;
  organizationId: string;
}) {
  await db.insert(chats).values({ id, title, userId, organizationId });
}

export async function updateChatTitle(id: string, title: string) {
  await db.update(chats).set({ title }).where(eq(chats.id, id));
}

export async function deleteChat(id: string) {
  await db.delete(chats).where(eq(chats.id, id));
}

export async function getChatsByUser({
  userId,
  organizationId,
  limit = 20,
  before,
}: {
  userId: string;
  organizationId: string;
  limit?: number;
  before?: string;
}) {
  const conditions = [
    eq(chats.userId, userId),
    eq(chats.organizationId, organizationId),
  ];
  if (before) {
    conditions.push(lt(chats.createdAt, new Date(before)));
  }

  const rows = await db
    .select()
    .from(chats)
    .where(and(...conditions))
    .orderBy(desc(chats.createdAt))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  return { chats: rows.slice(0, limit), hasMore };
}

export async function saveMessage({
  id,
  chatId,
  role,
  parts,
}: {
  id: string;
  chatId: string;
  role: string;
  parts: unknown;
}) {
  await db.insert(messages).values({ id, chatId, role, parts });
}

export async function updateMessage(id: string, parts: unknown) {
  await db.update(messages).set({ parts }).where(eq(messages.id, id));
}

export async function getMessages(chatId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));
}

export async function getChatById(id: string, organizationId: string) {
  const rows = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, id), eq(chats.organizationId, organizationId)))
    .limit(1);
  return rows[0] || null;
}

export async function deleteAllChats(userId: string, organizationId: string) {
  const result = await db
    .delete(chats)
    .where(
      and(eq(chats.userId, userId), eq(chats.organizationId, organizationId)),
    );
  return result.rowCount || 0;
}
