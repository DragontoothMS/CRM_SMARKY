import { TemplateDetailPage } from '@/modules/templates/components/template-detail-page';

export const metadata = {
  title: 'Plantilla · Smarky CRM',
};

/** El id se resuelve en cliente contra el workspace ya montado. */
export default async function TemplatePage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  return <TemplateDetailPage templateId={templateId} />;
}
