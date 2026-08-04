export type TagColor = 'teal' | 'blue' | 'violet' | 'amber' | 'rose' | 'slate';

export interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  color: TagColor;
}
