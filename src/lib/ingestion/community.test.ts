import { describe, expect, it } from 'vitest';

import { normalizeCommunityExtraction } from './community';

const REDDIT_URL =
  'https://www.reddit.com/r/SaaS/comments/abc123/onboarding_feedback';

describe('normalizeCommunityExtraction', () => {
  it('normalizes Reddit comments into community feedback items', () => {
    const result = normalizeCommunityExtraction(REDDIT_URL, {
      threadTitle: 'Onboarding feedback',
      comments: [
        {
          id: 't3_abc123',
          permalink: `${REDDIT_URL}/`,
          authorName: 'op_user',
          text: 'Our onboarding took three days and support never replied.',
          score: 42,
          isOriginalPost: true,
          createdAt: '2026-01-12T10:00:00.000Z',
        },
        {
          id: 't1_comment1',
          permalink: `${REDDIT_URL}/comment/comment1/`,
          authorName: 'helper',
          text: 'Same here — the checklist is confusing for new teams.',
          score: 11,
          parentId: 't3_abc123',
        },
      ],
    });

    expect(result.kind).toBe('community');
    expect(result.platform).toBe('reddit');
    expect(result.items).toHaveLength(2);

    const [op, reply] = result.items;
    expect(op).toMatchObject({
      source: 'community',
      rating: null,
      authorName: 'op_user',
      sourceItemId: 't3_abc123',
      metadata: {
        review_url: `${REDDIT_URL}/`,
        platform: 'reddit',
        thread_url: REDDIT_URL,
        score: 42,
        is_original_post: true,
      },
    });
    expect(reply.metadata.parent_id).toBe('t3_abc123');
    expect(reply.rating).toBeNull();
  });

  it('skips deleted / automod noise and empty text', () => {
    const result = normalizeCommunityExtraction(REDDIT_URL, {
      comments: [
        { id: '1', text: '[deleted]' },
        {
          id: '2',
          text: 'I am a bot, and this action was performed automatically.',
        },
        { id: '3', text: 'ok' },
        {
          id: '4',
          text: 'Checkout failed twice before I gave up and cancelled.',
          permalink: `${REDDIT_URL}/comment/4/`,
        },
      ],
    });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].sourceItemId).toBe('4');
  });

  it('uses permalink as sourceItemId when id is missing', () => {
    const permalink = `${REDDIT_URL}/comment/xyz/`;
    const result = normalizeCommunityExtraction(REDDIT_URL, {
      comments: [
        {
          permalink,
          authorName: 'anon',
          text: 'Pricing feels opaque compared to competitors in this space.',
        },
      ],
    });

    expect(result.items[0].sourceItemId).toBe(permalink);
    expect(result.items[0].metadata.review_url).toBe(permalink);
  });

  it('marks unknown hosts as web source', () => {
    const url = 'https://forum.example.com/t/slow-checkout/42';
    const result = normalizeCommunityExtraction(url, {
      comments: [
        {
          id: 'c1',
          text: 'The checkout page timed out after I entered card details.',
          permalink: `${url}#post-1`,
        },
      ],
    });

    expect(result.items[0].source).toBe('web');
    expect(result.items[0].metadata.platform).toBe('web');
  });

  it('rejects Google / Trustpilot URLs at the normalize seam', () => {
    expect(() =>
      normalizeCommunityExtraction(
        'https://www.trustpilot.com/review/www.wise.com',
        { comments: [{ id: '1', text: 'Great product overall experience.' }] },
      ),
    ).toThrow(/Trustpilot connector/i);
  });

  it('keeps upsert identity stable for the same comment twice', () => {
    const extraction = {
      comments: [
        {
          id: 'stable-1',
          text: 'Support replied in minutes and fixed our billing issue.',
          permalink: `${REDDIT_URL}/comment/stable-1/`,
        },
      ],
    };

    const first = normalizeCommunityExtraction(REDDIT_URL, extraction);
    const second = normalizeCommunityExtraction(REDDIT_URL, {
      comments: [
        {
          ...extraction.comments[0],
          text: 'Support replied in minutes and fixed our billing issue quickly.',
        },
      ],
    });

    expect(first.items[0].sourceItemId).toBe(second.items[0].sourceItemId);
    expect(second.items[0].text).toContain('quickly');
  });
});
