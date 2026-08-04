import type { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MobileTopBar, Sidebar } from './sidebar';

/**
 * Shell de la plataforma: alto fijo y sin scroll propio, para que cada panel del
 * módulo scrollee por separado. Server Component: el boundary de cliente baja a
 * los componentes que realmente interactúan.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
