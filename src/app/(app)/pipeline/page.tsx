import { PipelineBoard } from '@/modules/pipeline/components/pipeline-board';

export const metadata = {
  title: 'Pipeline · Smarky CRM',
};

/** Server Component: el boundary de cliente empieza en PipelineBoard. */
export default function PipelinePage() {
  return <PipelineBoard />;
}
