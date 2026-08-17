import { describe, expect, it } from 'vitest';

import { classifyCommunityUrl } from './community-url';

describe('classifyCommunityUrl', () => {
  it('classifies Reddit as first-class community', () => {
    const result = classifyCommunityUrl(
      'https://www.reddit.com/r/SaaS/comments/abc123/onboarding_feedback/?utm_source=share',
    );
    expect(result.blocked).toBe(false);
    expect(result.kind).toBe('community');
    expect(result.platform).toBe('reddit');
    expect(result.canonicalUrl).not.toContain('utm_source');
  });

  it('classifies Hacker News as community', () => {
    const result = classifyCommunityUrl(
      'https://news.ycombinator.com/item?id=12345',
    );
    expect(result).toMatchObject({
      blocked: false,
      kind: 'community',
      platform: 'hackernews',
    });
  });

  it('classifies Product Hunt as community', () => {
    const result = classifyCommunityUrl(
      'https://www.producthunt.com/posts/example-product',
    );
    expect(result).toMatchObject({
      blocked: false,
      kind: 'community',
      platform: 'producthunt',
    });
  });

  it('treats unknown hosts as best-effort web', () => {
    const result = classifyCommunityUrl(
      'https://forum.example.com/t/slow-checkout/42',
    );
    expect(result).toMatchObject({
      blocked: false,
      kind: 'web',
      platform: 'web',
    });
  });

  it('blocks Google Reviews / Maps URLs before crawl', () => {
    const result = classifyCommunityUrl(
      'https://www.google.com/maps/place/Example/@1,2,17z/data=!3m1!4b1',
    );
    expect(result.blocked).toBe(true);
    expect(result.kind).toBe('google_reviews');
    expect(result.blockReason).toMatch(/Google Reviews connector/i);
  });

  it('blocks Trustpilot URLs before crawl', () => {
    const result = classifyCommunityUrl(
      'https://www.trustpilot.com/review/www.wise.com',
    );
    expect(result.blocked).toBe(true);
    expect(result.kind).toBe('trustpilot');
    expect(result.blockReason).toMatch(/Trustpilot connector/i);
  });
});
