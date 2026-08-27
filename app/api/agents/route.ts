import { NextResponse } from 'next/server';
import { INITIAL_AGENTS, AgentCategory } from '@/lib/data/agents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as AgentCategory | null;
  const search = searchParams.get('search')?.toLowerCase();
  const sort = searchParams.get('sort') || 'reputation';

  let agents = [...INITIAL_AGENTS];

  // Integrate 8004scan API fallback for live third-party BSC agents
  const apiKey = process.env.SCAN8004_API_KEY;
  if (apiKey) {
    try {
      const scanRes = await fetch('https://api.8004scan.io/api/v1/agents?chainId=97', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 300 }, // Cache 5 min
      });
      if (scanRes.ok) {
        const scanData = await scanRes.json();
        if (Array.isArray(scanData.data)) {
          const thirdPartyAgents = scanData.data.map((item: any) => ({
            id: `scan_${item.tokenId || item.id}`,
            agentIdOnchain: String(item.tokenId || item.id),
            name: item.name || `BSC Agent #${item.tokenId}`,
            description: item.description || 'Verified ERC-8004 Autonomous Agent on BNB Smart Chain.',
            category: (item.category as AgentCategory) || 'GRID_TRADING',
            imageUrl: item.image || '/agents/default-agent.png',
            reputationCount: item.reputation?.count || 0,
            summaryValue: item.reputation?.score || '4.8',
            tags: item.tags || ['ERC-8004', '8004scan'],
            createdAt: item.createdAt || new Date().toISOString(),
            source: '8004scan',
          }));
          agents = [...agents, ...thirdPartyAgents];
        }
      }
    } catch (err) {
      console.warn('8004scan API query fallback:', err);
    }
  }

  let filtered = agents;

  if (category && (category as string) !== 'ALL') {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.tags.some((t) => t.toLowerCase().includes(search))
    );
  }

  if (sort === 'reputation') {
    filtered.sort((a, b) => parseFloat(b.summaryValue) - parseFloat(a.summaryValue));
  } else if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    agents: filtered,
  });
}
