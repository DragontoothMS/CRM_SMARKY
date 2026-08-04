'use client';

import { KanbanSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Contact } from '@/types';
import { useInbox } from '../../hooks/use-inbox';
import { PanelSection } from './panel-section';

/** Cambiar la etapa se refleja al instante en la fila y en el header del chat. */
export function ContactStageSection({ contact }: { contact: Contact }) {
  const { state, dispatch } = useInbox();
  const stages = Object.values(state.stages).sort((a, b) => a.order - b.order);

  // Sin badge además del selector: mostraban el mismo valor uno debajo del otro.
  return (
    <PanelSection title="Etapa" icon={KanbanSquare}>
      <Select
        items={stages.map((stage) => ({ label: stage.name, value: stage.id }))}
        value={contact.stageId}
        onValueChange={(stageId) =>
          dispatch({ type: 'SET_STAGE', contactId: contact.id, stageId: String(stageId) })
        }
      >
        <SelectTrigger className="h-10 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              {stage.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PanelSection>
  );
}
