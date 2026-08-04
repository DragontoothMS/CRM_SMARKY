import { redirect } from 'next/navigation';

/** El módulo principal pasó a llamarse Inbox. TODO: eliminar cuando /crm ya no esté en uso. */
export default function CrmPage() {
  redirect('/inbox');
}
