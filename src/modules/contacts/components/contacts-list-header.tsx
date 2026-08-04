'use client';

import { ListFilter, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { PipelineStage, Tag } from '@/types';
import {
  countActiveFilters,
  EMPTY_FILTERS,
  type ContactFilters,
} from '../hooks/use-visible-contacts';
import { ContactsFilters } from './contacts-filters';

interface ContactsListHeaderProps {
  filters: ContactFilters;
  total: number;
  tags: Tag[];
  stages: PipelineStage[];
  onChange: (patch: Partial<ContactFilters>) => void;
  onReset: () => void;
}

export function ContactsListHeader({
  filters,
  total,
  tags,
  stages,
  onChange,
  onReset,
}: ContactsListHeaderProps) {
  const activeFilters = countActiveFilters(filters);
  const hasAnything = activeFilters > 0 || filters.search.trim().length > 0;

  return (
    <div className="space-y-3 border-b border-border px-4 pt-4 pb-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Contactos</h1>
          <p className="text-xs text-muted-foreground">
            {total} {total === 1 ? 'contacto' : 'contactos'} en la vista
          </p>
        </div>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" size="icon" className="relative size-9">
                <ListFilter className="size-4" />
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
                <span className="sr-only">Filtros</span>
              </Button>
            }
          />
          <PopoverContent align="end" className="w-72">
            <ContactsFilters
              filters={filters}
              tags={tags}
              stages={stages}
              onChange={onChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Buscar por nombre, teléfono o usuario..."
          className="h-10 bg-surface pl-9"
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

export { EMPTY_FILTERS };
