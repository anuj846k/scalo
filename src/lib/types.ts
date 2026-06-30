import type { InferUITools, UIMessage, UIDataTypes } from 'ai';
import type { createSearchFeedbackTool } from '@/lib/ai/tools/search-feedback';

export type ChatTools = InferUITools<{
  searchFeedback: ReturnType<typeof createSearchFeedbackTool>;
}>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
