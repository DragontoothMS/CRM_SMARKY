'use client';

import type { PipelineStage, Tag } from '@/types';
import type { ContactSummary } from '../utils/contact-summary';
import type { ContactFilters } from '../hooks/use-visible-contacts';
import { ContactsEmptyState } from './contacts-empty-state';
import { ContactsListHeader } from './contacts-list-header';
import { ContactRow } from './contact-row';

interface ContactsListProps {
  summaries: ContactSummary[];
  filters: ContactFilters;
  tags: Record<string, Tag>;
  stages: Record<string, PipelineStage>;
  tagList: Tag[];
  stageList: PipelineStage[];
  selectedContactId: string | null;
  now: string;
  hasAnyContact: boolean;
  onChangeFilters: (patch: Partial<ContactFilters>) => void;
  onReset: () => void;
  onSelect: (contactId: string) => void;
}

export function ContactsList({
  summaries,
  filters,
  tags,
  stages,
  tagList,
  stageList,
  selectedContactId,
  now,
  hasAnyContact,
  onChangeFilters,
  onReset,
  onSelect,
}: ContactsListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <ContactsListHeader
        filters={filters}
        total={summaries.length}
        tags={tagList}
        stages={stageList}
        onChange={onChangeFilters}
        onReset={onReset}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {summaries.length === 0 ? (
          <ContactsEmptyState filtered={hasAnyContact} onReset={onReset} />
        ) : (
          summaries.map((summary) => (
            <ContactRow
              key={summary.contact.id}
              summary={summary}
              tags={summary.contact.tagIds.map((id) => tags[id]).filter(Boolean)}
              stage={stages[summary.contact.stageId]}
              isSelected={selectedContactId === summary.contact.id}
              now={now}
              onSelect={() => onSelect(summary.contact.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
