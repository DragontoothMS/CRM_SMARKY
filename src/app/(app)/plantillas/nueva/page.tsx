import { TemplateCreatePage } from '@/modules/templates/components/template-create-page';

export const metadata = {
  title: 'Nueva plantilla · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en TemplateCreatePage. */
export default function NuevaPlantillaPage() {
  return <TemplateCreatePage />;
}
