import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db/drizzle';
import { feedbackItems, connectorConfigs } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const url = new URL(req.url);
  const fromParam = url.searchParams.get('from');
  const toParam = url.searchParams.get('to');

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const rangeFrom = fromParam
    ? new Date(fromParam)
    : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const rangeTo = toParam ? new Date(toParam) : now;

  const [kpis, dailySentiment, recentReviews, sources] = await Promise.all([
    db
      .select({
        total: sql<number>`COUNT(*)::int`,
        avgRating: sql<number>`ROUND(AVG(${feedbackItems.rating}), 1)`,
        positive: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} >= 4 THEN 1 END)::int`,
        neutral: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} = 3 THEN 1 END)::int`,
        negative: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} <= 2 THEN 1 END)::int`,
        newThisWeek: sql<number>`COUNT(CASE WHEN ${feedbackItems.createdAt} >= ${sevenDaysAgo.toISOString()} THEN 1 END)::int`,
      })
      .from(feedbackItems)
      .where(eq(feedbackItems.organizationId, organizationId)),

    db
      .select({
        date: sql<string>`DATE(${feedbackItems.createdAt})`,
        total: sql<number>`COUNT(*)::int`,
        avgRating: sql<number>`ROUND(AVG(${feedbackItems.rating}), 1)`,
        positive: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} >= 4 THEN 1 END)::int`,
        negative: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} <= 2 THEN 1 END)::int`,
        neutral: sql<number>`COUNT(CASE WHEN ${feedbackItems.rating} = 3 THEN 1 END)::int`,
      })
      .from(feedbackItems)
      .where(
        and(
          eq(feedbackItems.organizationId, organizationId),
          gte(feedbackItems.createdAt, rangeFrom),
          lte(feedbackItems.createdAt, rangeTo),
        ),
      )
      .groupBy(sql`DATE(${feedbackItems.createdAt})`)
      .orderBy(sql`DATE(${feedbackItems.createdAt}) ASC`),

    db
      .select({
        text: feedbackItems.text,
        rating: feedbackItems.rating,
        authorName: feedbackItems.authorName,
        source: feedbackItems.source,
        createdAt: feedbackItems.createdAt,
        sourceItemId: feedbackItems.sourceItemId,
        metadataJson: feedbackItems.metadataJson,
      })
      .from(feedbackItems)
      .where(eq(feedbackItems.organizationId, organizationId))
      .orderBy(sql`${feedbackItems.createdAt} DESC`)
      .limit(10),

    db
      .select({
        count: sql<number>`COUNT(*)::int`,
      })
      .from(connectorConfigs)
      .where(
        and(
          eq(connectorConfigs.organizationId, organizationId),
          eq(connectorConfigs.status, 'active'),
        ),
      ),
  ]);

  const kpiRow = kpis[0];
  const total = Number(kpiRow?.total ?? 0);
  const avgRating = Number(kpiRow?.avgRating ?? 0);
  const positive = Number(kpiRow?.positive ?? 0);
  const neutral = Number(kpiRow?.neutral ?? 0);
  const negative = Number(kpiRow?.negative ?? 0);
  const newThisWeek = Number(kpiRow?.newThisWeek ?? 0);
  const sentimentRatio =
    total > 0
      ? {
          positive: Math.round((positive / total) * 100) / 100,
          neutral: Math.round((neutral / total) * 100) / 100,
          negative: Math.round((negative / total) * 100) / 100,
        }
      : { positive: 0, neutral: 0, negative: 0 };

  const sparklineReviewsPerDay: number[] = [];
  const sparklineAvgRating: number[] = [];
  const sparklineSentimentRatio: number[] = [];
  for (const day of dailySentiment.slice(-7)) {
    sparklineReviewsPerDay.push(Number(day.total));
    sparklineAvgRating.push(Number(day.avgRating ?? 0));
    sparklineSentimentRatio.push(
      Number(day.total) > 0
        ? Math.round((Number(day.positive) / Number(day.total)) * 100) / 100
        : 0,
    );
  }

  return NextResponse.json({
    kpis: {
      totalReviews: total,
      avgRating,
      sentimentRatio,
      newThisWeek,
      sourcesConnected: Number(sources[0]?.count ?? 0),
      sparklines: {
        reviewsPerDay: sparklineReviewsPerDay,
        avgRating: sparklineAvgRating,
        sentimentRatio: sparklineSentimentRatio,
        newThisWeek: sparklineReviewsPerDay,
      },
    },
    dailySentiment: dailySentiment.map((d) => ({
      date: d.date,
      total: Number(d.total),
      avgRating: Number(d.avgRating ?? 0),
      positive: Number(d.positive),
      negative: Number(d.negative),
      neutral: Number(d.neutral),
    })),
    recentReviews: recentReviews.map((r) => ({
      text: r.text,
      rating: r.rating,
      authorName: r.authorName,
      source: r.source,
      createdAt: r.createdAt,
      sourceUrl:
        (r.metadataJson as Record<string, unknown>)?.review_url ?? null,
    })),
  });
}
