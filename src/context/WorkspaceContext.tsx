
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Workspace, Board } from '@/types';
import { toast } from "sonner";

// Initial sample data
const initialWorkspace: Workspace[] = [
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

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  addWorkspace: (title: string, description: string) => void;
  updateWorkspace: (id: string, title: string, description: string) => void;
  deleteWorkspace: (id: string) => void;
  addBoard: (workspaceId: string, title: string) => void;
  deleteBoard: (workspaceId: string, boardId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspace);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(initialWorkspace[0]);

  const setCurrentWorkspace = (workspace: Workspace) => {
    setCurrentWorkspaceState(workspace);
  };

  const addWorkspace = (title: string, description: string) => {
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      title,
      description,
      boards: [],
    };
    setWorkspaces([...workspaces, newWorkspace]);
    toast.success("Workspace created");
  };

  const updateWorkspace = (id: string, title: string, description: string) => {
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => 
        workspace.id === id 
          ? { ...workspace, title, description } 
          : workspace
      )
    );
    
    // Also update currentWorkspace if it's the one being modified
    if (currentWorkspace && currentWorkspace.id === id) {
      setCurrentWorkspaceState({ ...currentWorkspace, title, description });
    }
    
    toast.success("Workspace updated");
  };

  const deleteWorkspace = (id: string) => {
    setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== id));
    
    // If deleted workspace is the current one, set first available workspace as current
    if (currentWorkspace && currentWorkspace.id === id) {
      const remainingWorkspaces = workspaces.filter(w => w.id !== id);
      setCurrentWorkspaceState(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
    }
    
    toast.success("Workspace deleted");
  };

  const addBoard = (workspaceId: string, title: string) => {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      lists: [],
    };
    
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => 
        workspace.id === workspaceId 
          ? { ...workspace, boards: [...workspace.boards, newBoard] } 
          : workspace
      )
    );
    
    // Update current workspace if needed
    if (currentWorkspace && currentWorkspace.id === workspaceId) {
      setCurrentWorkspaceState({
        ...currentWorkspace,
        boards: [...currentWorkspace.boards, newBoard]
      });
    }
    
    toast.success("Board added");
  };

  const deleteBoard = (workspaceId: string, boardId: string) => {
    setWorkspaces(prevWorkspaces => 
      prevWorkspaces.map(workspace => 
        workspace.id === workspaceId 
          ? { 
              ...workspace, 
              boards: workspace.boards.filter(board => board.id !== boardId) 
            } 
          : workspace
      )
    );
    
    // Update current workspace if needed
    if (currentWorkspace && currentWorkspace.id === workspaceId) {
      setCurrentWorkspaceState({
        ...currentWorkspace,
        boards: currentWorkspace.boards.filter(board => board.id !== boardId)
      });
    }
    
    toast.success("Board deleted");
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        addWorkspace,
        updateWorkspace,
        deleteWorkspace,
        addBoard,
        deleteBoard,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
