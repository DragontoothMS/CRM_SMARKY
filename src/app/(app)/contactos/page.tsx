import { ContactsLayout } from '@/modules/contacts/components/contacts-layout';

export const metadata = {
  title: 'Contactos · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en ContactsLayout. */
export default function ContactosPage() {
  return <ContactsLayout />;
}
