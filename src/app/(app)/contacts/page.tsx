import { redirect } from 'next/navigation';

/** Compatibilidad: las rutas del producto están en español. */
export default function ContactsPage() {
  redirect('/contactos');
}
