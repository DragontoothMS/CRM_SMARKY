'use client';

import { CalendarDays, Clock, User } from 'lucide-react';
import { formatDateTimeLong } from '@/lib/format';
import type { Contact, Conversation } from '@/types';
import { PanelSection } from './panel-section';

/**
 * Nombre, identidad y canal viven en el encabezado del panel; acá quedan solo
 * las fechas, que son el dato que no se repite en ningún otro lado.
 */
export function ContactInfoSection({
  contact,
  conversation,
}: {
  contact: Contact;
  conversation: Conversation;
}) {
  return (
    <PanelSection title="Información" icon={User}>
      <dl className="space-y-2.5 text-sm">
        <Row
          icon={CalendarDays}
          label="Creado"
          value={formatDateTimeLong(contact.createdAt)}
        />
        <Row
          icon={Clock}
          label="Última interacción"
          value={formatDateTimeLong(conversation.lastMessageAt)}
        />
      </dl>
    </PanelSection>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm text-foreground">{value}</dd>
      </div>
    </div>
  );
}
