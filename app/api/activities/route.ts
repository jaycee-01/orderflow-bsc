import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const apiKey = process.env.SCAN8004_API_KEY;
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const res = await fetch('https://api.8004scan.io/api/v1/feedbacks?chain_id=97&limit=20', {
      headers,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`8004scan feedback API failed: ${res.status}`);
    }

    const data = await res.json();
    const items = data.items || data.data || [];

    const activities = items.map((f: any, i: number) => {
      const agentName = f.agent?.name || `BSC Agent #${f.agent?.token_id || f.agent_id || '8004'}`;
      const action = f.tag1 ? `Attested: ${f.tag1}` : (f.comment ? `Feedback: "${f.comment.substring(0, 24)}..."` : 'Reputation Attestation');
      const scoreVal = f.score ? `${f.score} Pts` : (f.value ? `${f.value} Val` : 'Verified');
      const shortHash = f.transaction_hash ? `${f.transaction_hash.substring(0, 6)}...${f.transaction_hash.slice(-4)}` : `0x${i}8f2...901c`;

      return {
        id: f.id || `feed_${i}`,
        time: f.submitted_at ? new Date(f.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        agentName,
        action,
        amount: scoreVal,
        status: f.is_revoked ? 'REVOKED' : 'VERIFIED',
        txHash: shortHash,
        isLive: true,
      };
    });

    return NextResponse.json({
      success: true,
      activities: activities.length > 0 ? activities : null,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      activities: null,
    });
  }
}
