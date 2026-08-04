'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, SearchX, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TemplateCategory } from '@/types';
import { useTemplatesView } from '../hooks/use-templates-view';
import {
  CATEGORY_LABEL,
  matchesSearch,
  matchesStatusFilter,
  type TemplateStatusFilter,
} from '../utils/template-filters';
import { TemplateRow } from './template-row';
import { TemplateCard } from './template-card';
import { TemplatesSkeleton } from './templates-skeleton';
import { EmptyState } from './empty-state';

const STATUS_TABS: Array<[TemplateStatusFilter, string]> = [
  ['all', 'Todas'],
  ['draft', 'Borradores'],
  ['pending', 'En revisión'],
  ['approved', 'Aprobadas'],
  ['rejected', 'Rechazadas'],
  ['paused', 'Pausadas'],
  ['disabled', 'Deshabilitadas'],
  ['problems', 'Con problemas'],
  ['trash', 'Papelera'],
];

type CategoryFilter = TemplateCategory | 'all';
const CATEGORY_TABS: Array<[CategoryFilter, string]> = [
  ['all', 'Todas las categorías'],
  ['marketing', CATEGORY_LABEL.marketing],
  ['utility', CATEGORY_LABEL.utility],
  ['authentication', CATEGORY_LABEL.authentication],
];

export function TemplatesList() {
  const view = useTemplatesView();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TemplateStatusFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');

  const visible = useMemo(() => {
    if (!view) return [];
    return view.templates.filter(
      (t) =>
        matchesStatusFilter(t, status) &&
        (category === 'all' || t.category === category) &&
        matchesSearch(t, search),
    );
  }, [view, status, category, search]);

  if (!view) return <TemplatesSkeleton />;

  const noneAtAll = view.activeCount === 0 && view.trashCount === 0;
  const isTrash = status === 'trash';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 space-y-3 border-b border-border bg-surface px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Plantillas</h1>
            <p className="text-xs text-muted-foreground">
              {view.activeCount} {view.activeCount === 1 ? 'plantilla' : 'plantillas'} · WhatsApp
              {view.trashCount > 0 && ` · ${view.trashCount} en papelera`}
            </p>
          </div>
          <Button size="sm" className="h-9 shrink-0" nativeButton={false} render={<Link href="/plantillas/nueva" />}>
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nueva plantilla</span>
            <span className="sr-only sm:hidden">Nueva plantilla</span>
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, contenido o idioma..."
            className="h-9 bg-surface pl-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={cn(
                'flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                status === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted-foreground hover:text-foreground',
              )}
            >
              {value === 'trash' && <Trash2 className="size-3" />}
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={cn(
                'rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors',
                category === value
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {noneAtAll ? (
          <EmptyState
            icon={FileText}
            title="Todavía no hay plantillas"
            hint="Las plantillas de WhatsApp reutilizables aparecerán acá."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={isTrash ? Trash2 : SearchX}
            title={isTrash ? 'Papelera vacía' : 'Sin resultados'}
            hint={
              isTrash
                ? 'No hay plantillas eliminadas localmente.'
                : 'Ninguna plantilla coincide con la búsqueda o el filtro aplicado.'
            }
          />
        ) : (
          <>
            {/* Filas en desktop/tablet, cards en móvil: sin tablas horizontales. */}
            <div className="hidden sm:block">
              {visible.map((template) => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </div>
            <div className="space-y-3 p-4 sm:hidden">
              {visible.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
