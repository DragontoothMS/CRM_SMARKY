'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/modules/inbox/hooks/use-media-query';
import { useContactsView } from '../hooks/use-contacts-view';
import {
  EMPTY_FILTERS,
  useVisibleContacts,
  type ContactFilters,
} from '../hooks/use-visible-contacts';
import { ContactDetail } from './contact-detail';
import { ContactsList } from './contacts-list';
import { ContactsSkeleton } from './contacts-skeleton';

/**
 * Desktop (≥1280px): lista + detalle como columnas.
 * Laptop/tablet: detalle como overlay para no comprimir la lista.
 * Móvil: una vista por vez.
 */
export function ContactsLayout() {
  // Los datos son del workspace; acá solo vive lo visual.
  const data = useContactsView();
  const [filters, setFilters] = useState<ContactFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const isWide = useMediaQuery('(min-width: 1280px)');
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const visible = useVisibleContacts(data?.summaries ?? [], filters);

  if (!data) return <ContactsSkeleton />;

  const { tagsById, stagesById } = data;
  const selected = visible.find((s) => s.contact.id === selectedId) ?? null;
  const selectedStage = selected ? stagesById[selected.contact.stageId] : undefined;
  const selectedNotes = selected
    ? selected.conversations.flatMap((c) => data.notesByConversation[c.conversation.id] ?? [])
    : [];

  function handleSelect(contactId: string) {
    setSelectedId(contactId);
    setMobileView('detail');
  }

  function handleReset() {
    setFilters(EMPTY_FILTERS);
  }

  const list = (
    <ContactsList
      summaries={visible}
      filters={filters}
      tags={tagsById}
      stages={stagesById}
      tagList={data.tags}
      stageList={data.stages}
      selectedContactId={selectedId}
      now={data.seededAt}
      hasAnyContact={data.summaries.length > 0}
      onChangeFilters={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
      onReset={handleReset}
      onSelect={handleSelect}
    />
  );

  const detail = selected ? (
    <ContactDetail
      summary={selected}
      tags={selected.contact.tagIds.map((id) => tagsById[id]).filter(Boolean)}
      stage={selectedStage}
      notes={selectedNotes}
      now={data.seededAt}
      onBack={isMobile ? () => setMobileView('list') : undefined}
      onClose={!isMobile ? () => setSelectedId(null) : undefined}
    />
  ) : null;

  return (
    <div className="flex h-full min-h-0">
      <div
        className={cn(
          'w-full min-w-0 shrink-0 border-r border-border lg:block lg:w-[380px] xl:w-[420px]',
          mobileView === 'detail' && 'hidden lg:block',
        )}
      >
        {list}
      </div>

      {/* Desktop: el detalle ocupa el resto; sin selección, un vacío que orienta. */}
      <div className={cn('min-w-0 flex-1', mobileView === 'list' && 'hidden lg:block')}>
        {isWide && detail ? (
          detail
        ) : selected && isMobile ? (
          detail
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-background px-6 text-center">
            <Users className="size-9 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Ningún contacto seleccionado</p>
            <p className="text-xs text-muted-foreground">
              Elegí uno de la lista para ver su ficha y sus conversaciones.
            </p>
          </div>
        )}
      </div>

      {/* Laptop/tablet: overlay, para no comprimir la lista. */}
      {!isWide && !isMobile && detail && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20"
            onClick={() => setSelectedId(null)}
            aria-label="Cerrar detalle"
          />
          <div className="absolute inset-y-0 right-0 w-[min(420px,92vw)] border-l border-border shadow-lg">
            {detail}
          </div>
        </div>
      )}
    </div>
  );
}
