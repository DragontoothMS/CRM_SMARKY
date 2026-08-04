'use client';

import { ListFilter, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CHANNEL_META } from '@/lib/channels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CHANNELS, type Channel, type Tag } from '@/types';
import {
  countActiveFilters,
  type AiFilter,
  type PipelineFilters,
} from '../hooks/use-visible-cards';

interface PipelineHeaderProps {
  filters: PipelineFilters;
  total: number;
  tags: Tag[];
  onChange: (patch: Partial<PipelineFilters>) => void;
  onReset: () => void;
}

export function PipelineHeader({ filters, total, tags, onChange, onReset }: PipelineHeaderProps) {
  const active = countActiveFilters(filters);
  const hasAnything = active > 0 || filters.search.trim().length > 0;

  return (
    <div className="shrink-0 space-y-3 border-b border-border bg-surface px-4 pt-4 pb-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Pipeline</h1>
          <p className="text-xs text-muted-foreground">
            {total} {total === 1 ? 'oportunidad' : 'oportunidades'} en la vista
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Buscar por nombre o mensaje..."
              className="h-9 bg-surface pl-9"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onChange({ search: '' })}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar búsqueda"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="icon" className="relative size-9">
                  <ListFilter className="size-4" />
                  {active > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {active}
                    </span>
                  )}
                  <span className="sr-only">Filtros</span>
                </Button>
              }
            />
            <PopoverContent align="end" className="w-72 space-y-3">
              {/* Sin filtro por etapa: las columnas ya son las etapas. */}
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
                    {CHANNEL_META[channel].label}
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
                  <Chip
                    key={value}
                    active={filters.ai === value}
                    onClick={() => onChange({ ai: value })}
                  >
                    {label}
                  </Chip>
                ))}
              </Group>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {hasAnything && (
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-primary hover:underline"
        >
          Limpiar filtros
        </button>
      )}
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
        'rounded-md border px-2 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-surface text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}
