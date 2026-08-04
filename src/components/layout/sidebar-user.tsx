import { cn } from '@/lib/utils';
import { getAvatarColor, getInitials } from '@/lib/avatar';
import { CURRENT_USER } from '@/mocks';

/** Perfil demo del pie del sidebar. No hay autenticación. */
export function SidebarUser({ collapsed }: { collapsed: boolean }) {
  return (
    <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white',
          getAvatarColor(CURRENT_USER.name),
        )}
      >
        {getInitials(CURRENT_USER.name)}
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{CURRENT_USER.name}</p>
          <p className="truncate text-xs text-muted-foreground">{CURRENT_USER.role}</p>
        </div>
      )}
    </div>
  );
}
