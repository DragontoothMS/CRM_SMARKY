import { CampaignDetailPage } from '@/modules/campaigns/components/campaign-detail-page';

export const metadata = {
  title: 'Campaña · Smarky CRM',
};

/** El id se resuelve en cliente contra el workspace ya montado. */
export default async function CampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return <CampaignDetailPage campaignId={campaignId} />;
}
