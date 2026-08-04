import { CampaignsList } from '@/modules/campaigns/components/campaigns-list';

export const metadata = {
  title: 'Campañas · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en CampaignsList. */
export default function CampanasPage() {
  return <CampaignsList />;
}
