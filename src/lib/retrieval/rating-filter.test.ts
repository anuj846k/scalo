import { describe, expect, it } from 'vitest';

import { shouldIncludeNullRatings } from './rating-filter';

describe('shouldIncludeNullRatings', () => {
  it('includes null ratings for unfiltered chat search', () => {
    expect(shouldIncludeNullRatings()).toBe(true);
    expect(shouldIncludeNullRatings(undefined, undefined)).toBe(true);
  });

  it('excludes null ratings when an explicit star filter is set', () => {
    expect(shouldIncludeNullRatings(4)).toBe(false);
    expect(shouldIncludeNullRatings(undefined, 2)).toBe(false);
    expect(shouldIncludeNullRatings(1, 5)).toBe(false);
  });
});
