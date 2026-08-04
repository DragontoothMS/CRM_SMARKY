/**
 * Primer paint de /inbox, antes de que el seed se genere en cliente.
 * Servidor y cliente renderizan esto igual, así no hay hydration mismatch.
 */
export function InboxSkeleton() {
  return (
    <div className="flex h-full animate-pulse">
      <div className="hidden w-[380px] shrink-0 flex-col gap-3 border-r border-border bg-surface p-4 lg:flex">
        <div className="h-6 w-40 rounded bg-secondary" />
        <div className="h-10 w-full rounded-lg bg-secondary" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-3 py-2">
            <div className="size-11 shrink-0 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-secondary" />
              <div className="h-3 w-full rounded bg-secondary" />
              <div className="h-4 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-16 shrink-0 border-b border-border bg-surface" />
        <div className="flex-1 bg-background" />
        <div className="h-16 shrink-0 border-t border-border bg-surface" />
      </div>
      <div className="hidden w-[340px] shrink-0 border-l border-border bg-surface xl:block" />
    </div>
  );
}
