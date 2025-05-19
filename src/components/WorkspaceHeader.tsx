import React from "react";
import WorkspaceSelector from "./WorkspaceSelector";
import CreateWorkspace from "./CreateWorkspace";
import ThemeToggle from "./ThemeToggle";
import SettingsDialog from "./settings/SettingsDialog";
import UserAvatar from "./UserAvatar";
import { useWorkspace } from "@/context/workspace";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export default function WorkspaceHeader() {
  const { currentWorkspace } = useWorkspace();

  return (
    <div className="p-2 sm:p-4 border-b bg-background">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-primary">
            Simplify
          </h1>

          {/* Desktop view */}
          <div className="hidden md:flex items-center gap-4">
            <WorkspaceSelector />
            <CreateWorkspace />
          </div>

          {/* Mobile view */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <div className="flex flex-col gap-4 mt-8">
                <WorkspaceSelector />
                <CreateWorkspace />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {currentWorkspace && (
            <div className="hidden sm:block text-sm text-muted-foreground">
              {currentWorkspace.description}
            </div>
          )}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsDialog />
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <UserAvatar />
          </div>
        </div>
      </div>
    </div>
  );
}
