'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';
import { SidebarNavItem } from './sidebar-nav-item';
import { SidebarUser } from './sidebar-user';

/** Navegación de la plataforma. Muestra icono y texto por defecto; se contrae a solo iconos. */
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:flex',
        collapsed ? 'w-[72px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center gap-2.5 px-3', collapsed && 'justify-center px-0')}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-base font-semibold tracking-tight text-foreground">
              Smarky CRM
            </span>
            {/* Contraer vive acá: como fila propia gastaba 36px en una acción rara. */}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Contraer menú"
            >
              <PanelLeftClose className="size-[18px]" />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mb-1 flex h-10 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Expandir menú"
          >
            <PanelLeftOpen className="size-[18px]" />
          </button>
        )}
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <SidebarUser collapsed={collapsed} />
      </div>
    </aside>
  );
}

/** Barra superior con la marca; reemplaza al sidebar en móvil. */
export function MobileTopBar() {
  return (
    <header className="flex h-14 items-center gap-2.5 border-b border-border bg-sidebar px-4 md:hidden">
      <Link href="/inbox" className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="size-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">Smarky CRM</span>
      </Link>
    </header>
  );
}
