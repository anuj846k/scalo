import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

// DataForSEO calls this URL (GET) when a task completes.
// The task ID is passed via the `$id` variable in the pingback_url template.
export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('id');

  if (taskId) {
    await inngest.send({
      name: 'dataforseo.task-completed',
      data: { taskId },
    });
  }

  return new NextResponse('ok');
}
