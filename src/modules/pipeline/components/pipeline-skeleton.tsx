/** Primer paint de /pipeline, antes de que el workspace hidrate en cliente. */
export function PipelineSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col">
      <div className="space-y-3 border-b border-border bg-surface px-4 pt-4 pb-3">
        <div className="h-6 w-28 rounded bg-secondary" />
        <div className="h-9 w-64 rounded-lg bg-secondary" />
      </div>
      <div className="flex flex-1 gap-3 overflow-hidden p-4">
        {Array.from({ length: 4 }).map((_, column) => (
          <div key={column} className="w-[288px] shrink-0 space-y-2">
            <div className="h-4 w-24 rounded bg-secondary" />
            {Array.from({ length: 2 }).map((_, card) => (
              <div key={card} className="h-24 rounded-xl bg-secondary" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
