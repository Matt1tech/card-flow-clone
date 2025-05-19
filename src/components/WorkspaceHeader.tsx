
import React from 'react';
import WorkspaceSelector from './WorkspaceSelector';
import CreateWorkspace from './CreateWorkspace';
import ThemeToggle from './ThemeToggle';
import SettingsDialog from './settings/SettingsDialog';
import UserAvatar from './UserAvatar';
import { useWorkspace } from '@/context/workspace';
import { Separator } from './ui/separator';

export default function WorkspaceHeader() {
  const { currentWorkspace } = useWorkspace();

  return (
    <div className="p-4 border-b bg-background">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Trello Clone</h1>
          <WorkspaceSelector />
          <CreateWorkspace />
        </div>
        
        <div className="flex items-center gap-4">
          {currentWorkspace && (
            <div className="text-sm text-muted-foreground">
              {currentWorkspace.description}
            </div>
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDialog />
            <Separator orientation="vertical" className="h-6" />
            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}
