
import React, { useState } from 'react';
import { useWorkspace } from '@/context/workspace';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function WorkspaceSelector() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          {currentWorkspace?.title || 'Select Workspace'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {workspaces.map((workspace) => (
          <DropdownMenuItem 
            key={workspace.id}
            className={workspace.id === currentWorkspace?.id ? 'bg-muted font-medium' : ''}
            onClick={() => setCurrentWorkspace(workspace)}
          >
            {workspace.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
