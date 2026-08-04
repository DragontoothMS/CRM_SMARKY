import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import type { Channel } from '@/types';

/** Pill con icono y nombre del canal. Se usa en el header del chat y el panel derecho. */
export function ChannelBadge({ channel, className }: { channel: Channel; className?: string }) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground',
        className,
      )}
    >
      <span
        className={cn('flex size-4 items-center justify-center rounded-full', meta.badgeClass)}
        aria-hidden
      >
        <Icon className="size-2.5 text-white" />
      </span>
      {meta.label}
    </span>
  );
}
