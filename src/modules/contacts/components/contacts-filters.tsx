'use client';

import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import { CHANNELS, type Channel, type PipelineStage, type Tag } from '@/types';
import type { AiFilter, ContactFilters } from '../hooks/use-visible-contacts';

interface ContactsFiltersProps {
  filters: ContactFilters;
  tags: Tag[];
  stages: PipelineStage[];
  onChange: (patch: Partial<ContactFilters>) => void;
}

/** Grupos de chips: canal, etapa, etiqueta e IA. Volver a tocar el activo lo desactiva. */
export function ContactsFilters({ filters, tags, stages, onChange }: ContactsFiltersProps) {
  return (
    <div className="space-y-3">
      <Group title="Canal">
        <Chip active={filters.channel === 'all'} onClick={() => onChange({ channel: 'all' })}>
          Todos
        </Chip>
        {CHANNELS.map((channel: Channel) => (
          <Chip
            key={channel}
            active={filters.channel === channel}
            onClick={() =>
              onChange({ channel: filters.channel === channel ? 'all' : channel })
            }
          >
            <span
              className={cn(
                'size-2 rounded-full',
                CHANNEL_META[channel].badgeClass,
                filters.channel === channel && 'bg-white',
              )}
              aria-hidden
            />
            {CHANNEL_META[channel].label}
          </Chip>
        ))}
      </Group>

      <Group title="Etapa">
        {stages.map((stage) => (
          <Chip
            key={stage.id}
            active={filters.stageId === stage.id}
            onClick={() =>
              onChange({ stageId: filters.stageId === stage.id ? null : stage.id })
            }
          >
            {stage.name}
          </Chip>
        ))}
      </Group>

      <Group title="Etiqueta">
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            active={filters.tagId === tag.id}
            onClick={() => onChange({ tagId: filters.tagId === tag.id ? null : tag.id })}
          >
            {tag.name}
          </Chip>
        ))}
      </Group>

      <Group title="Respuesta con IA">
        {(
          [
            ['all', 'Todas'],
            ['on', 'Activa'],
            ['off', 'Desactivada'],
          ] as Array<[AiFilter, string]>
        ).map(([value, label]) => (
          <Chip key={value} active={filters.ai === value} onClick={() => onChange({ ai: value })}>
            {label}
          </Chip>
        ))}
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
