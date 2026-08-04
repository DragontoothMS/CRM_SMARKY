import { TemplateEditPage } from '@/modules/templates/components/template-edit-page';

export const metadata = {
  title: 'Editar plantilla · Smarky CRM',
};

/** El id se resuelve en cliente contra el workspace ya montado. */
export default async function EditarPlantillaPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return <TemplateEditPage templateId={templateId} />;
}
