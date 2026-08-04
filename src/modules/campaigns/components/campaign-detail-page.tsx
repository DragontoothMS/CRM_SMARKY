'use client';

import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/modules/workspace/state/workspace-context';
import { CampaignDetail } from './campaign-detail';
import { CampaignsSkeleton } from './campaigns-skeleton';

/**
 * Resuelve la campaña por id. Un id inválido muestra "Campaña no encontrada" con
 * salida a la lista, nunca una redirección silenciosa.
 */
export function CampaignDetailPage({ campaignId }: { campaignId: string }) {
  const { state } = useWorkspace();
  if (!state) return <CampaignsSkeleton />;

  const campaign = state.campaigns[campaignId];
  if (!campaign) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
          <PackageX className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">Campaña no encontrada</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          La campaña que buscás no existe o fue eliminada.
        </p>
        <Button size="sm" className="mt-1 h-9" nativeButton={false} render={<Link href="/campanas" />}>
          Volver a campañas
        </Button>
      </div>
    );
  }

  return <CampaignDetail campaign={campaign} />;
}
