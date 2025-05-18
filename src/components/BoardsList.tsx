
import React, { useState } from 'react';
import { useWorkspace } from '@/context/WorkspaceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BoardsList() {
  const { currentWorkspace, addBoard, deleteBoard } = useWorkspace();
  const [isAdding, setIsAdding] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');

  const handleAddBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardTitle.trim() && currentWorkspace) {
      addBoard(currentWorkspace.id, boardTitle);
      setBoardTitle('');
      setIsAdding(false);
    }
  };

  const handleDeleteBoard = (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentWorkspace) {
      deleteBoard(currentWorkspace.id, boardId);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No workspace selected. Please select or create a workspace.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-1">{currentWorkspace.title}</h2>
        <p className="text-muted-foreground">{currentWorkspace.description}</p>
      </div>

      <h3 className="text-lg font-medium mb-4">Your Boards</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentWorkspace.boards.map(board => (
          <Link to={`/board/${board.id}`} key={board.id} className="block">
            <Card className="h-32 p-4 hover:bg-muted/30 transition-colors cursor-pointer group relative">
              <h3 className="font-medium">{board.title}</h3>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={(e) => handleDeleteBoard(board.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          </Link>
        ))}

        {isAdding ? (
          <Card className="h-32 p-4">
            <form onSubmit={handleAddBoard} className="h-full flex flex-col">
              <Input
                placeholder="Enter board title..."
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                autoFocus
                className="mb-2"
              />
              <div className="flex items-center gap-2 mt-auto">
                <Button 
                  type="submit" 
                  size="sm" 
                  disabled={!boardTitle.trim()}
                >
                  Add Board
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setIsAdding(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card 
            className="h-32 p-4 flex items-center justify-center text-muted-foreground bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border-dashed"
            onClick={() => setIsAdding(true)}
          >
            <div className="flex flex-col items-center">
              <Plus className="h-8 w-8 mb-1" />
              <span>Add new board</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
