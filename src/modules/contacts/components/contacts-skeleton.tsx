/**
 * Primer paint de /contactos, antes de que el seed se genere en cliente.
 * Servidor y cliente renderizan lo mismo, así no hay hydration mismatch.
 */
export function ContactsSkeleton() {
  return (
    <div className="flex h-full animate-pulse">
      <div className="w-full shrink-0 flex-col gap-3 border-r border-border bg-surface p-4 lg:flex lg:w-[380px] xl:w-[420px]">
        <div className="h-6 w-32 rounded bg-secondary" />
        <div className="h-10 w-full rounded-lg bg-secondary" />
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex gap-3 py-2">
            <div className="size-11 shrink-0 rounded-full bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-secondary" />
              <div className="h-3 w-1/2 rounded bg-secondary" />
              <div className="h-4 w-1/3 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden flex-1 bg-background lg:block" />
    </div>
  );
}
