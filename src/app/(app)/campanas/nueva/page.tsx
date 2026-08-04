import { CampaignWizard } from '@/modules/campaigns/components/campaign-wizard';

export const metadata = {
  title: 'Nueva campaña · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en CampaignWizard. */
export default function NuevaCampanaPage() {
  return <CampaignWizard />;
}
