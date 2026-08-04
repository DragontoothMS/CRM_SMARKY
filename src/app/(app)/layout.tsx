import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { WorkspaceProvider } from '@/modules/workspace/state/workspace-context';
import { QueryProvider } from '@/components/query-provider';

/**
 * Sigue siendo Server Component: `children` se pasa como slot, así que las
 * páginas no se vuelven cliente por estar dentro del provider.
 *
 * WorkspaceProvider se monta acá para que el seed sobreviva a la navegación
 * entre módulos. No lee search params, así que no obliga a Suspense ni vuelve
 * dinámicas las rutas.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <WorkspaceProvider>
        <AppShell>{children}</AppShell>
      </WorkspaceProvider>
    </QueryProvider>
  );
}
