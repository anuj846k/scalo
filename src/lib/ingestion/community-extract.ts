import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

import type { CommunityExtractionInput } from './community';

const MAX_MARKDOWN_CHARS = 120_000;
const MAX_COMMENTS = 80;

const extractionSchema = z.object({
  threadTitle: z.string().nullable(),
  comments: z.array(
    z.object({
      id: z.string().nullable(),
      permalink: z.string().nullable(),
      authorName: z.string().nullable(),
      text: z.string(),
      score: z.number().nullable(),
      parentId: z.string().nullable(),
      createdAt: z.string().nullable(),
      isOriginalPost: z.boolean().nullable(),
    }),
  ),
});

/**
 * LLM structured extract: page markdown → comments (+ OP when substantive).
 */
export async function extractCommunityComments(
  url: string,
  markdown: string,
  pageTitle?: string | null,
): Promise<CommunityExtractionInput> {
  const clipped =
    markdown.length > MAX_MARKDOWN_CHARS
      ? `${markdown.slice(0, MAX_MARKDOWN_CHARS)}\n\n[truncated]`
      : markdown;

  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: extractionSchema,
    prompt: `Extract discussion comments from this public thread page for a customer-feedback product.

URL: ${url}
Page title hint: ${pageTitle ?? '(none)'}

Rules:
- Return one object per distinct comment/reply with substantive text.
- Include the original post as a comment with isOriginalPost=true when it has substantive text (complaint, praise, question with context). Skip empty title-only OPs.
- Skip deleted/removed/automod/bot-only noise when obvious.
- Prefer stable comment ids when present in the page; otherwise use permalink URLs.
- permalink should be the deepest comment URL when available, else the thread URL.
- score is platform points/upvotes (integer or null). Never invent a 1-5 star rating.
- createdAt as ISO-8601 when available, else null.
- Cap at ${MAX_COMMENTS} most substantive comments (prefer higher score / longer text).
- If this is not a discussion page and there are no comments, return comments: [].

Page markdown:
${clipped}`,
  });

  return {
    threadTitle: object.threadTitle,
    comments: object.comments.slice(0, MAX_COMMENTS).map((comment) => ({
      id: comment.id,
      permalink: comment.permalink,
      authorName: comment.authorName,
      text: comment.text,
      score: comment.score,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      isOriginalPost: comment.isOriginalPost,
    })),
  };
}
