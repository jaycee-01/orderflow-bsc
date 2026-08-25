import { NextResponse } from 'next/server';
import { INITIAL_AGENTS } from '@/lib/data/agents';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const agent = INITIAL_AGENTS.find((a) => a.id === params.id || a.agentIdOnchain === params.id);

  if (!agent) {
    return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    agent,
  });
}
