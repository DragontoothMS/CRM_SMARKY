import type { LucideIcon } from 'lucide-react';

/** Estado vacío reutilizable (sin datos / sin resultados / papelera vacía). */
export function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{hint}</p>
      {action}
    </div>
  );
}
