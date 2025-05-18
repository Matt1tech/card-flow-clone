
import React, { useState, ReactNode } from 'react';
import { Workspace, Board } from '@/types';
import { toast } from "sonner";
import { WorkspaceContext } from './WorkspaceContext';
import { initialWorkspaces } from '@/data/initialWorkspaces';

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(initialWorkspaces[0]);

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
