import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tag, TagColor } from '@/types';

const TAG_CLASSES: Record<TagColor, string> = {
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  blue: 'bg-sky-50 text-sky-700 border-sky-200',
  violet: 'bg-violet-50 text-violet-700 border-violet-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function TagBadge({
  tag,
  onRemove,
  className,
}: {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium',
        TAG_CLASSES[tag.color],
        className,
      )}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="-mr-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100"
          aria-label={`Quitar etiqueta ${tag.name}`}
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}

/** Muestra hasta `max` etiquetas y resume el resto como "+N". */
export function TagBadgeList({
  tags,
  max = 2,
  className,
}: {
  tags: Tag[];
  max?: number;
  className?: string;
}) {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {visible.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
      {hidden > 0 && (
        <span className="inline-flex items-center rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          +{hidden}
        </span>
      )}
    </div>
  );
}
