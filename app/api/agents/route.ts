import { NextResponse } from 'next/server';
import { INITIAL_AGENTS, AgentCategory } from '@/lib/data/agents';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as AgentCategory | null;
  const search = searchParams.get('search')?.toLowerCase();
  const sort = searchParams.get('sort') || 'reputation'; // reputation | winRate | recent

  let filtered = [...INITIAL_AGENTS];

  if (category && category !== 'ALL' as any) {
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
