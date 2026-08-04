'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { NavItem } from './nav-items';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
}

export function SidebarNavItem({ item, isActive, collapsed }: SidebarNavItemProps) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
        collapsed && 'justify-center px-0',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
      )}
    >
      <Icon className={cn('size-[18px] shrink-0', isActive && 'text-primary')} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  // Con el sidebar contraído el texto desaparece, así que el tooltip lo reemplaza.
  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
