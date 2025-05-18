
import React, { useEffect, useState } from 'react';
import { WorkspaceProvider } from '@/context/workspace';
import { BoardProvider } from '@/context/BoardContext';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import Board from '@/components/Board';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [boardName, setBoardName] = useState<string>(boardId || "");
  
  // Extract board name from ID for better display
  useEffect(() => {
    if (boardId) {
      const formattedName = boardId.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      setBoardName(formattedName);
    }
  }, [boardId]);
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <WorkspaceProvider>
        <WorkspaceHeader />
        <div className="bg-muted/30 dark:bg-muted/10 p-2 flex items-center border-b">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Boards
            </Link>
          </Button>
          <h1 className="text-lg font-medium">{boardName}</h1>
        </div>
        <main className="flex-1 bg-background overflow-hidden flex flex-col">
          <BoardProvider>
            <Board />
          </BoardProvider>
        </main>
      </WorkspaceProvider>
    </div>
  );
};

export default BoardView;
