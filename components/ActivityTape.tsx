'use client';

import { useEffect, useState } from 'react';
import { INITIAL_ACTIVITY_TAPE } from '@/lib/data/agents';
import { ArrowUpRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  time: string;
  agentName: string;
  action: string;
  amount: string;
  status: string;
  txHash: string;
  isLive?: boolean;
}

export function ActivityTape() {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITY_TAPE);
  const [isLiveStream, setIsLiveStream] = useState(false);

  useEffect(() => {
    async function fetchLiveFeedbacks() {
      try {
        const res = await fetch('/api/activities');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.activities) && data.activities.length > 0) {
            setActivities(data.activities);
            setIsLiveStream(true);
          }
        }
      } catch (err) {
        console.warn('Using labeled sample activity tape:', err);
      }
    }
    fetchLiveFeedbacks();
  }, []);

  return (
    <div className="w-full bg-fog-light/60 border-y border-fog-light overflow-hidden py-3 text-xs font-mono select-none">
      <div className="mx-auto max-w-7xl px-4 flex items-center gap-4">
        
        {/* Ticker Badge */}
        <div className={`flex items-center gap-2 shrink-0 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider font-mono ${
          isLiveStream
            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-700'
            : 'bg-signal/15 border border-signal/40 text-signal-text'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isLiveStream ? 'bg-emerald-500' : 'bg-signal'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isLiveStream ? 'bg-emerald-500' : 'bg-signal'
            }`}></span>
          </span>
          {isLiveStream ? 'LIVE 8004 FEEDBACK' : 'SAMPLE ORDERFLOW'}
        </div>

        {/* Ticker Stream */}
        <div className="overflow-hidden flex-1 relative">
          <div className="flex whitespace-nowrap animate-ticker gap-8 hover:[animation-play-state:paused] font-mono">
            {[...activities, ...activities, ...activities].map((act, i) => (
              <div key={`${act.id}-${i}`} className="inline-flex items-center gap-3 text-bone-muted text-[11px]">
                <span className="text-signal-text font-semibold font-mono">[{act.time}]</span>
                <span className="text-bone font-medium">{act.agentName}</span>
                <span className="text-bone-muted">→ {act.action}</span>
                <span className="text-signal-text font-mono font-semibold">{act.amount}</span>
                <span className="text-[10px] bg-delta-green/15 text-delta-green px-1.5 py-0.5 rounded font-mono font-semibold border border-delta-green/30">
                  {act.status}
                </span>
                <span className="text-[10px] text-bone-muted/80 flex items-center gap-0.5 font-mono hover:text-signal-text cursor-pointer">
                  {act.txHash} <ArrowUpRight className="h-2.5 w-2.5 inline" />
                </span>
                <span className="text-bone-muted/40">|</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
