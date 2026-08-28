import { NextResponse } from 'next/server';
import { FLAGSHIP_AGENTS, AgentCategory } from '@/lib/data/agents';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // 1. Check Flagship preview array
  const flagship = FLAGSHIP_AGENTS.find((a) => a.id === id || a.agentIdOnchain === id);
  if (flagship) {
    return NextResponse.json({ success: true, agent: flagship });
  }

  // 2. Fetch directly from 8004scan API if token id or scan prefix
  const tokenId = id.replace('scan_', '');
  try {
    const res = await fetch(`https://api.8004scan.io/api/v1/agents/97/${tokenId}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;

      const score = typeof item.average_score === 'number' && item.average_score > 0
        ? item.average_score.toFixed(1)
        : (typeof item.total_score === 'number' && item.total_score > 0 ? item.total_score.toFixed(1) : '95.0');

      let detectedCategory: AgentCategory = 'GRID_TRADING';
      const lowerDesc = ((item.name || '') + ' ' + (item.description || '')).toLowerCase();
      if (lowerDesc.includes('yield') || lowerDesc.includes('apy') || lowerDesc.includes('farm')) {
        detectedCategory = 'YIELD';
      } else if (lowerDesc.includes('health') || lowerDesc.includes('risk') || lowerDesc.includes('liquidat')) {
        detectedCategory = 'HEALTH_FACTOR';
      } else if (lowerDesc.includes('rebalanc') || lowerDesc.includes('portfolio') || lowerDesc.includes('index')) {
        detectedCategory = 'REBALANCING';
      }

      return NextResponse.json({
        success: true,
        agent: {
          id: `scan_${tokenId}`,
          agentIdOnchain: String(tokenId),
          name: item.name || `BSC Agent #${tokenId}`,
          description: item.description || 'Verified ERC-8004 Autonomous Agent on BNB Smart Chain Testnet.',
          category: detectedCategory,
          imageUrl: item.image_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          ownerAddress: item.owner_address ? `${item.owner_address.substring(0, 6)}...${item.owner_address.slice(-4)}` : '0x8004...97',
          agentWallet: item.owner_address || '0x8004a818bfb912233c491871b3d84c89a494bd9e',
          isOwnBuild: false,
          isPreview: false,
          reputationCount: item.total_feedbacks || item.star_count || 10,
          summaryValue: score,
          winRate: item.supported_protocols?.includes('A2A') ? 'A2A Enabled' : '96.2%',
          avgResponseMs: 240,
          services: [
            { name: "Execute Strategy", endpoint: `/api/agents/scan_${tokenId}/execute`, type: "x402-REST", pricePerCall: "1.00 U" }
          ],
          tags: item.supported_protocols ? ['ERC-8004', ...item.supported_protocols] : ['ERC-8004', '8004scan'],
          createdAt: item.created_at || new Date().toISOString(),
          source: '8004scan',
        }
      });
    }
  } catch (err) {
    console.error('Failed to fetch individual agent from 8004scan:', err);
  }

  return NextResponse.json({ success: false, error: 'Agent not found' }, { status: 404 });
}
