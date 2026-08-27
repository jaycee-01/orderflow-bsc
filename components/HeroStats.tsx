'use client';

import { useEffect, useState } from 'react';

function useCountUp(target: number, duration: number = 800, decimals: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad: progress * (2 - progress)
      const easeOutProgress = progress * (2 - progress);
      setCount(easeOutProgress * target);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count.toFixed(decimals);
}

export function HeroStats() {
  const agentsCount = useCountUp(200, 800, 0);
  const categoriesCount = useCountUp(4, 800, 0);
  const reputationScore = useCountUp(97.8, 800, 1);

  return (
    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-fog-light/60 font-mono">
      <div>
        <div className="text-2xl font-bold text-bone">
          {agentsCount}K+
        </div>
        <div className="text-xs text-bone-muted uppercase tracking-wider">BSC Indexed Agents</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-signal">
          {categoriesCount}/4
        </div>
        <div className="text-xs text-bone-muted uppercase tracking-wider">Equal Depth Categories</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-bone">
          {reputationScore}%
        </div>
        <div className="text-xs text-bone-muted uppercase tracking-wider">Avg Reputation Score</div>
      </div>
    </div>
  );
}
