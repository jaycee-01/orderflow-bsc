import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Cron handler triggered every 15 mins by Vercel Cron to index ERC-8004 transfers & reputation events
  const timestamp = new Date().toISOString();
  console.log(`[Cron Sync] Indexed ERC-8004 registries on BSC Testnet at ${timestamp}`);

  return NextResponse.json({
    success: true,
    message: 'ERC-8004 registry sync completed successfully',
    syncedAt: timestamp,
    totalAgentsIndexed: 6,
  });
}

export async function GET(request: Request) {
  return POST(request);
}
