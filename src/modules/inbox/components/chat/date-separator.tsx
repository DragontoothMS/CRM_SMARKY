export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-4">
      <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
