
import { Workspace } from '@/types';

// Initial sample data
export const initialWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    title: 'Personal',
    description: 'My personal tasks and projects',
    boards: [
      {
        id: 'board-1',
        title: 'Project Alpha',
        lists: []
      }
    ],
  },
  {
    id: 'workspace-2',
    title: 'Work',
    description: 'Professional tasks and projects',
    boards: [
      {
        id: 'board-2',
        title: 'Client Projects',
        lists: []
      }
    ],
  }
];
