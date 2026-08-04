import {
  Contact,
  FileText,
  Home,
  Inbox,
  KanbanSquare,
  Megaphone,
  Plug,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Los módulos aún no construidos muestran un placeholder. */
  ready?: boolean;
}

/**
 * Smarky es una plataforma de módulos; el Inbox es solo el primero construido.
 *
 * Lista plana, sin encabezados de grupo: con ocho ítems visibles a la vez los
 * títulos no ayudaban a encontrar nada y agregaban dos líneas de ruido.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/inicio', icon: Home },
  { label: 'Inbox', href: '/inbox', icon: Inbox, ready: true },
  { label: 'Contactos', href: '/contactos', icon: Contact, ready: true },
  { label: 'Pipeline', href: '/pipeline', icon: KanbanSquare, ready: true },
  { label: 'Campañas', href: '/campanas', icon: Megaphone, ready: true },
  { label: 'Plantillas', href: '/plantillas', icon: FileText, ready: true },
  { label: 'Integraciones', href: '/integraciones', icon: Plug },
  { label: 'Configuración', href: '/configuracion', icon: Settings },
];
