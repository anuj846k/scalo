import { NextResponse } from 'next/server';

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: process.env.META_REDIRECT_URI!,
    response_type: 'code',
    scope: [
      'instagram_business_basic',
      'instagram_business_manage_messages',
      'instagram_business_manage_comments',
      'instagram_business_content_publish',
    ].join(','),
  });

  return NextResponse.redirect(
    `https://www.instagram.com/oauth/authorize?${params.toString()}`,
  );
}
