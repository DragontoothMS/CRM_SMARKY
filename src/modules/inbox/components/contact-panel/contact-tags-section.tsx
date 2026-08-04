'use client';

import { Plus, Tags } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TagBadge } from '@/components/common/tag-badge-list';
import type { Contact } from '@/types';
import { useInbox } from '../../hooks/use-inbox';
import { PanelSection } from './panel-section';

/** Los cambios se reflejan solos en la lista: las etiquetas viven en el contacto. */
export function ContactTagsSection({ contact }: { contact: Contact }) {
  const { state, dispatch } = useInbox();
  const assigned = contact.tagIds.map((id) => state.tags[id]).filter(Boolean);
  const available = Object.values(state.tags).filter((tag) => !contact.tagIds.includes(tag.id));

  return (
    <PanelSection
      title="Etiquetas"
      icon={Tags}
      action={
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="size-7" disabled={available.length === 0}>
                <Plus className="size-4" />
                <span className="sr-only">Agregar etiqueta</span>
              </Button>
            }
          />
          <PopoverContent align="end" className="w-56">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Agregar etiqueta
            </p>
            <div className="flex flex-wrap gap-1.5">
              {available.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => dispatch({ type: 'ADD_TAG', contactId: contact.id, tagId: tag.id })}
                >
                  <TagBadge tag={tag} className="cursor-pointer hover:opacity-80" />
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      }
    >
      {assigned.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin etiquetas asignadas.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {assigned.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => dispatch({ type: 'REMOVE_TAG', contactId: contact.id, tagId: tag.id })}
            />
          ))}
        </div>
      )}
    </PanelSection>
  );
}
