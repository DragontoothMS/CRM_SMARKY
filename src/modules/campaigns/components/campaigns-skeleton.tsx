/** Primer paint de /campanas, antes de que el workspace hidrate en cliente. */
export function CampaignsSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col">
      <div className="space-y-3 border-b border-border bg-surface px-4 pt-4 pb-3">
        <div className="h-6 w-32 rounded bg-secondary" />
        <div className="h-9 w-full max-w-md rounded-lg bg-secondary" />
        <div className="h-6 w-64 rounded bg-secondary" />
      </div>
      <div className="flex-1 space-y-px p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-16 rounded-lg bg-secondary" />
        ))}
      </div>
    </div>
  );
}
