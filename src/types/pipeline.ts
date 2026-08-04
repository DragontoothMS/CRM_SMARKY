export type StageColor = 'slate' | 'blue' | 'amber' | 'teal' | 'green' | 'red';

export interface PipelineStage {
  id: string;
  workspaceId: string;
  name: string;
  order: number;
  color: StageColor;
}
