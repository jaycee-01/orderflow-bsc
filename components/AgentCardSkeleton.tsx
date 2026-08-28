export function AgentCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-fog-light bg-fog p-5 flex flex-col justify-between h-[230px]"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-fog-light rounded" />
              <div className="h-3 w-14 bg-fog-light rounded" />
            </div>
            <div className="h-5 w-3/4 bg-fog-light rounded" />
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-fog-light/70 rounded" />
              <div className="h-3 w-4/5 bg-fog-light/70 rounded" />
            </div>
          </div>

          <div className="pt-4 border-t border-fog-light/60 space-y-3">
            <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-fog-light/40 rounded border border-fog-light">
              <div className="h-6 bg-fog-light rounded" />
              <div className="h-6 bg-fog-light rounded" />
              <div className="h-6 bg-fog-light rounded" />
            </div>
            <div className="h-8 w-full bg-fog-light rounded" />
          </div>
        </div>
      ))}
    </>
  );
}
