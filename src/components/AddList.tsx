
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { useBoard } from '@/context/BoardContext';

export default function AddList() {
  const { addList } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addList(title);
      setTitle('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <Card className="w-72 bg-muted/40 p-2 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              placeholder="Enter list title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={!title.trim()}>
                Add List
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
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Button
      variant="outline"
      className="h-12 w-72 justify-start bg-muted/40 border-dashed"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="mr-2 h-4 w-4" /> Add a list
    </Button>
  );
}
