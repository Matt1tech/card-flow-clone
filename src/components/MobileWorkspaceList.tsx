import React from "react";
import { useWorkspace } from "@/context/workspace";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MobileWorkspaceList() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const maxVisible = 4;
  const visible = workspaces.slice(0, maxVisible);
  const overflow = workspaces.slice(maxVisible);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((ws) => (
        <Button
          key={ws.id}
          size="sm"
          variant={ws.id === currentWorkspace?.id ? "default" : "outline"}
          className="truncate max-w-[90px]"
          onClick={() => setCurrentWorkspace(ws)}
        >
          {ws.title}
        </Button>
      ))}
      {overflow.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {overflow.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => setCurrentWorkspace(ws)}
                className={
                  ws.id === currentWorkspace?.id ? "bg-muted font-medium" : ""
                }
              >
                {ws.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
