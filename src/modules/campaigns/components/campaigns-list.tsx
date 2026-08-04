'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus, Search, SearchX, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCampaignsView, type StatusFilter } from '../hooks/use-campaigns-view';
import { CampaignCard } from './campaign-card';
import { CampaignRow } from './campaign-row';
import { CampaignsSkeleton } from './campaigns-skeleton';

const STATUS_TABS: Array<[StatusFilter, string]> = [
  ['all', 'Todas'],
  ['draft', 'Borradores'],
  ['scheduled', 'Programadas'],
  ['completed', 'Enviadas'],
  ['failed', 'Fallidas'],
  ['cancelled', 'Canceladas'],
];

export function CampaignsList() {
  const view = useCampaignsView();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');

  const visible = useMemo(() => {
    if (!view) return [];
    const q = search.trim().toLowerCase();
    return view.campaigns.filter((campaign) => {
      if (status !== 'all' && campaign.status !== status) return false;
      if (!q) return true;
      const template = view.templatesById[campaign.templateId];
      return (
        campaign.name.toLowerCase().includes(q) ||
        (template?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [view, search, status]);

  if (!view) return <CampaignsSkeleton />;

  const noneAtAll = view.total === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 space-y-3 border-b border-border bg-surface px-4 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Campañas</h1>
            <p className="text-xs text-muted-foreground">
              {view.total} {view.total === 1 ? 'campaña' : 'campañas'} · WhatsApp
            </p>
          </div>
          <Button size="sm" className="h-9" nativeButton={false} render={<Link href="/campanas/nueva" />}>
            <Plus className="size-4" />
            Nueva campaña
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o plantilla..."
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
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                status === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted-foreground hover:text-foreground',
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
            icon={Megaphone}
            title="Todavía no hay campañas"
            hint="Creá tu primera campaña para enviar una plantilla de WhatsApp a tus contactos."
            action={
              <Button size="sm" className="mt-1 h-9" nativeButton={false} render={<Link href="/campanas/nueva" />}>
                <Plus className="size-4" />
                Nueva campaña
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            hint="Ninguna campaña coincide con la búsqueda o el filtro aplicado."
            action={
              <Button
                variant="outline"
                size="sm"
                className="mt-1 h-9"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <>
            {/* Filas en desktop/tablet, cards en móvil: sin tablas horizontales. */}
            <div className="hidden sm:block">
              {visible.map((campaign) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  template={view.templatesById[campaign.templateId]}
                />
              ))}
            </div>
            <div className="space-y-3 p-4 sm:hidden">
              {visible.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  template={view.templatesById[campaign.templateId]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: typeof Megaphone;
  title: string;
  hint: string;
  action: React.ReactNode;
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
