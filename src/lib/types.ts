import type { InferUITools, UIMessage, UIDataTypes } from 'ai';
import type { searchFeedback } from '@/lib/ai/tools/search-feedback';

export type ChatTools = InferUITools<{ searchFeedback: typeof searchFeedback }>;

export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;
