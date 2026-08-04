'use client';

import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import { CHANNELS, type Channel } from '@/types';
import { useInbox } from '../../hooks/use-inbox';
import type { ChannelFilter } from '../../state/inbox-types';

const OPTIONS: Array<{ value: ChannelFilter; label: string }> = [
  { value: 'all', label: 'Todos' },
  ...CHANNELS.map((channel: Channel) => ({
    value: channel as ChannelFilter,
    label: CHANNEL_META[channel].label,
  })),
];

/** Pestañas de canal. Se derivan de CHANNELS: un canal nuevo aparece solo. */
export function ChannelFilterTabs({
  value,
  onChange,
}: {
  value: ChannelFilter;
  onChange: (value: ChannelFilter) => void;
}) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto">
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        const meta = option.value === 'all' ? null : CHANNEL_META[option.value as Channel];
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-muted-foreground hover:text-foreground',
            )}
          >
            {meta && (
              <span
                className={cn('size-2 rounded-full', meta.badgeClass, isActive && 'bg-white')}
                aria-hidden
              />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Filtros de etiqueta y etapa. Viven en el popover del header. */
export function FilterOptions() {
  const { state, dispatch } = useInbox();
  const { filters } = state;

  return (
    <div className="space-y-3">
      <FilterGroup
        title="Etiqueta"
        options={Object.values(state.tags).map((tag) => ({ id: tag.id, name: tag.name }))}
        selectedId={filters.tagId}
        onSelect={(tagId) => dispatch({ type: 'SET_TAG_FILTER', tagId })}
      />
      <FilterGroup
        title="Etapa"
        options={Object.values(state.stages)
          .sort((a, b) => a.order - b.order)
          .map((stage) => ({ id: stage.id, name: stage.name }))}
        selectedId={filters.stageId}
        onSelect={(stageId) => dispatch({ type: 'SET_STAGE_FILTER', stageId })}
      />
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selectedId,
  onSelect,
}: {
  title: string;
  options: Array<{ id: string; name: string }>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              // Volver a tocar el filtro activo lo desactiva.
              onClick={() => onSelect(isActive ? null : option.id)}
              className={cn(
                'rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted-foreground hover:text-foreground',
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
