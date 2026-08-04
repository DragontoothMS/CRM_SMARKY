import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import { getAvatarColor, getInitials } from '@/lib/avatar';
import type { Channel } from '@/types';

interface ChannelAvatarProps {
  name: string;
  channel: Channel;
  /** Diámetro en px. 44 en la lista, 40 en el header, 64 en el panel. */
  size?: number;
  className?: string;
}

/** Avatar de iniciales con el distintivo de canal en la esquina inferior derecha. */
export function ChannelAvatar({ name, channel, size = 44, className }: ChannelAvatarProps) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  const badgeSize = Math.round(size * 0.42);

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <div
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full font-semibold text-white select-none',
          getAvatarColor(name),
        )}
        style={{ fontSize: size * 0.36 }}
      >
        {getInitials(name)}
      </div>
      <span
        className={cn(
          'absolute -right-0.5 -bottom-0.5 flex items-center justify-center rounded-full ring-2 ring-surface',
          meta.badgeClass,
        )}
        style={{ width: badgeSize, height: badgeSize }}
        aria-label={meta.label}
      >
        <Icon className="text-white" style={{ width: badgeSize * 0.6, height: badgeSize * 0.6 }} />
      </span>
    </div>
  );
}
