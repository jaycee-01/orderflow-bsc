import { NextResponse } from 'next/server';
import { FLAGSHIP_AGENTS, AgentCategory, AgentData } from '@/lib/data/agents';

// Allow Next.js and Vercel Edge cache to respect revalidate & Cache-Control headers
export const revalidate = 60;

// In-memory cache for fast local responses within the same container
let cachedAgents: AgentData[] | null = null;
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

// Heuristic keyword classifier function
function classifyAgentCategory(name: string, description: string): AgentCategory | null {
  const full = (name + ' ' + description).toLowerCase();

  // 1. YIELD
  if (
    full.includes('yield') ||
    full.includes('apy') ||
    full.includes('farm') ||
    full.includes('compound') ||
    full.includes('harvest')
  ) {
    return 'YIELD';
  }

  // 2. HEALTH FACTOR
  if (
    full.includes('health') ||
    full.includes('liquidation') ||
    full.includes('liquidat') ||
    full.includes('loan') ||
    full.includes('venus') ||
    full.includes('collateral') ||
    full.includes('borrow') ||
    full.includes('debt')
  ) {
    return 'HEALTH_FACTOR';
  }

  // 3. REBALANCING
  if (
    full.includes('rebalanc') ||
    full.includes('portfolio') ||
    full.includes('index') ||
    full.includes('basket') ||
    full.includes('range keeper') ||
    full.includes('ranger') ||
    full.includes('rangekeeper') ||
    full.includes('drift') ||
    full.includes('concentrated')
  ) {
    return 'REBALANCING';
  }

  // 4. GRID TRADING
  if (
    full.includes('grid') ||
    full.includes('order block') ||
    full.includes('fvg') ||
    full.includes('arbitrage') ||
    full.includes('trading') ||
    full.includes('trade') ||
    full.includes('market maker') ||
    full.includes('volatility') ||
    full.includes('prediction') ||
    full.includes('breakout') ||
    full.includes('smart money')
  ) {
    return 'GRID_TRADING';
  }

  return null;
}

function isHighQualityAgent(item: any): boolean {
  const name = (item.name || '').toLowerCase();
  const desc = (item.description || '').trim();

  if (!desc || desc.length < 18) return false;
  if (desc.toLowerCase().startsWith('description for')) return false;
  if (name.includes('client-') && name.includes('.agent')) return false;
  if (name.startsWith('agent #')) return false;
  if (desc.toLowerCase().includes('testnet workflow validation')) return false;
  if (desc.toLowerCase().includes('throwaway probe')) return false;

  return true;
}

async function fetchLiveAgentsFromRegistry(): Promise<AgentData[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const apiKey = process.env.SCAN8004_API_KEY;
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  // Paginate 200 items in parallel across offsets
  const fetchPromises = [0, 50, 100, 150].map((offset) =>
    fetch(`https://api.8004scan.io/api/v1/agents?chain_id=97&limit=50&offset=${offset}`, {
      headers,
      next: { revalidate: 60 },
    })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .catch(() => ({ items: [] }))
  );

  const results = await Promise.all(fetchPromises);
  const rawItems: any[] = [];
  results.forEach((res) => {
    const pageItems = res.items || res.data || [];
    if (Array.isArray(pageItems)) {
      rawItems.push(...pageItems);
    }
  });

  // Deduplicate by token ID
  const seen = new Set<string>();
  const uniqueItems = rawItems.filter((item) => {
    const key = String(item.token_id || item.tokenId || item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const qualityItems = uniqueItems.filter(isHighQualityAgent);
  const mappedLiveAgents: AgentData[] = [];

  qualityItems.forEach((item) => {
    const tokenId = String(item.token_id || item.tokenId || item.id);
    const name = item.name || `BSC Agent #${tokenId}`;
    const description = item.description || '';
    const detectedCategory = classifyAgentCategory(name, description);
    const assignedCategory: AgentCategory = detectedCategory || 'GRID_TRADING';

    const score =
      typeof item.average_score === 'number' && item.average_score > 0
        ? item.average_score.toFixed(1)
        : typeof item.total_score === 'number' && item.total_score > 0
        ? item.total_score.toFixed(1)
        : '96.5';

    mappedLiveAgents.push({
      id: `scan_${tokenId}`,
      agentIdOnchain: tokenId,
      name,
      description,
      category: assignedCategory,
      imageUrl:
        item.image_url ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      ownerAddress: item.owner_address
        ? `${item.owner_address.substring(0, 6)}...${item.owner_address.slice(-4)}`
        : '0x8004...97',
      agentWallet: item.owner_address || '0x8004a818bfb912233c491871b3d84c89a494bd9e',
      isOwnBuild: false,
      isPreview: false,
      reputationCount: item.total_feedbacks || item.star_count || 14,
      summaryValue: score,
      winRate: item.supported_protocols?.includes('A2A') ? 'A2A Verified' : 'Live Strategy',
      avgResponseMs: Math.floor(Math.random() * 180) + 160,
      services: [
        {
          name: 'Execute Agent Service',
          endpoint: `/api/agents/scan_${tokenId}/execute`,
          type: item.x402_supported ? 'x402-REST' : 'ERC-8183',
          pricePerCall: '1.00 U',
        },
      ],
      tags: item.supported_protocols
        ? ['ERC-8004', ...item.supported_protocols]
        : ['ERC-8004', 'BSC Testnet'],
      createdAt: item.created_at || new Date().toISOString(),
      source: '8004scan',
    });
  });

  return mappedLiveAgents;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as AgentCategory | 'ALL' | null;
  const search = searchParams.get('search')?.toLowerCase();
  const sort = searchParams.get('sort') || 'reputation';
  const includePreviews = searchParams.get('includePreviews') !== 'false';

  const now = Date.now();
  let liveAgents: AgentData[] = [];
  let errorMsg: string | null = null;

  // Serve from memory cache if fresh (<60s)
  if (cachedAgents && now - lastCacheTimestamp < CACHE_TTL_MS) {
    liveAgents = cachedAgents;
  } else {
    try {
      liveAgents = await fetchLiveAgentsFromRegistry();
      if (liveAgents.length > 0) {
        cachedAgents = liveAgents;
        lastCacheTimestamp = now;
      }
    } catch (err: any) {
      console.error('Error fetching live agents:', err);
      errorMsg = err.message;
      if (cachedAgents) {
        liveAgents = cachedAgents;
      }
    }
  }

  // Combine Flagship Previews + Live Quality Agents
  let allAgents: AgentData[] = [];
  if (includePreviews) {
    allAgents = [...FLAGSHIP_AGENTS, ...liveAgents];
  } else {
    allAgents = liveAgents;
  }

  let filtered = allAgents;

  if (category && category !== 'ALL') {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        (a.tags && a.tags.some((t) => t.toLowerCase().includes(search)))
    );
  }

  if (sort === 'reputation') {
    filtered.sort((a, b) => parseFloat(b.summaryValue) - parseFloat(a.summaryValue));
  } else if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json(
    {
      success: !errorMsg || liveAgents.length > 0,
      total: filtered.length,
      liveQualityCount: liveAgents.length,
      previewCount: FLAGSHIP_AGENTS.length,
      cached: now - lastCacheTimestamp < CACHE_TTL_MS,
      agents: filtered,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
