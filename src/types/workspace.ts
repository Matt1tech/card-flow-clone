
import { Workspace } from '@/types';

export interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  addWorkspace: (title: string, description: string) => void;
  updateWorkspace: (id: string, title: string, description: string) => void;
  deleteWorkspace: (id: string) => void;
  addBoard: (workspaceId: string, title: string) => void;
  deleteBoard: (workspaceId: string, boardId: string) => void;
}
