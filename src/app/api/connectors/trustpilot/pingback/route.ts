import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/inngest/client';

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
