'use client';

import { ListFilter, PenSquare, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInbox } from '../../hooks/use-inbox';
import { ChannelFilterTabs, FilterOptions } from './conversation-filters';

export function ConversationListHeader({ total }: { total: number }) {
  const { state, dispatch } = useInbox();
  const { filters } = state;
  const activeExtraFilters = Number(Boolean(filters.tagId)) + Number(Boolean(filters.stageId));

  return (
    <div className="space-y-3 border-b border-border px-4 pt-4 pb-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Conversaciones</h2>
          <p className="text-xs text-muted-foreground">{total} en la vista</p>
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" size="icon" className="relative size-9">
                  <ListFilter className="size-4" />
                  {activeExtraFilters > 0 && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                      {activeExtraFilters}
                    </span>
                  )}
                  <span className="sr-only">Filtros</span>
                </Button>
              }
            />
            <PopoverContent align="end" className="w-64">
              <FilterOptions />
            </PopoverContent>
          </Popover>

          {/* Solo visual: no se pueden iniciar conversaciones sin canal conectado. */}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button variant="outline" size="icon" className="size-9" disabled>
                  <PenSquare className="size-4" />
                  <span className="sr-only">Nueva conversación</span>
                </Button>
              }
            />
            <TooltipContent>Disponible al conectar un canal</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => dispatch({ type: 'SET_SEARCH', search: event.target.value })}
          placeholder="Buscar contacto o mensaje..."
          className="h-10 bg-surface pl-9"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_SEARCH', search: '' })}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <ChannelFilterTabs
        value={filters.channel}
        onChange={(channel) => dispatch({ type: 'SET_CHANNEL_FILTER', channel })}
      />
    </div>
  );
}
