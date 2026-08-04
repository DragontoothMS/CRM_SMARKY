import { Suspense } from 'react';
import { InboxProvider } from '@/modules/inbox/state/inbox-context';
import { InboxLayout } from '@/modules/inbox/components/inbox-layout';
import { InboxSkeleton } from '@/modules/inbox/components/inbox-skeleton';

export const metadata = {
  title: 'Inbox · Smarky CRM',
};

/**
 * Server Component: el boundary de cliente empieza en InboxProvider.
 * El Suspense lo exige useSearchParams (lee `?c=`) para poder prerenderizar.
 */
export default function InboxPage() {
  return (
    <Suspense fallback={<InboxSkeleton />}>
      <InboxProvider fallback={<InboxSkeleton />}>
        <InboxLayout />
      </InboxProvider>
    </Suspense>
  );
}
