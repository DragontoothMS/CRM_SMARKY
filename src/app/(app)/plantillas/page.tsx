import { TemplatesList } from '@/modules/templates/components/templates-list';

export const metadata = {
  title: 'Plantillas · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en TemplatesList. */
export default function PlantillasPage() {
  return <TemplatesList />;
}
