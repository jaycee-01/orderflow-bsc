import { NextResponse } from 'next/server';
import { FLAGSHIP_AGENTS } from '@/lib/data/agents';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { taskDescription } = body;

    if (!taskDescription || typeof taskDescription !== 'string') {
      return NextResponse.json(
        { success: false, error: 'taskDescription is required' },
        { status: 400 }
      );
    }

    const agentId = params.id;
    // Find agent from local flagships or fallback
    const agent = FLAGSHIP_AGENTS.find(
      (a) => a.id === agentId || a.agentIdOnchain === agentId
    );

    const listedPrice = agent ? agent.price : '0.10';

    // Check if agent is one of our own flagship builds
    const isOwnBuild = agent ? agent.isOwnBuild : false;

    if (isOwnBuild) {
      // TODO: Phase 3 - Invoke real per-agent dynamic quote engine (e.g. strategy complexity analysis, gas estimate, risk premium)
      // Since Phase 3 dynamic quote engines are not yet built, fall back to flat rate listing
    }

    // For all current agents, return flat listed price with explicit flat_rate quoteType
    return NextResponse.json({
      success: true,
      agentId,
      quotedPrice: listedPrice,
      quoteType: 'flat_rate',
      label: 'Estimated: flat rate (this agent doesn\'t yet provide task-specific quotes)',
      currency: '$U',
      validitySeconds: 3600,
    });
  } catch (err: any) {
    console.error('Error generating agent quote:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate task quote' },
      { status: 500 }
    );
  }
}
