/**
 * Community/web feedback often has rating=null.
 * Unfiltered search must include those rows; explicit star filters exclude them.
 */
export function shouldIncludeNullRatings(
  ratingMin?: number,
  ratingMax?: number,
): boolean {
  return ratingMin === undefined && ratingMax === undefined;
}
