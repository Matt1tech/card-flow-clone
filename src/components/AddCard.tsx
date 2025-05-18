
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useBoard } from '@/context/BoardContext';

interface AddCardProps {
  listId: string;
}

export default function AddCard({ listId }: AddCardProps) {
  const { addCard } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addCard(listId, { title, description });
      setTitle('');
      setDescription('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <Card className="p-2 mb-2">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              placeholder="Enter card title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
              autoFocus
            />
            <Textarea
              placeholder="Add a description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs min-h-[60px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!title.trim()}>
                Add
              </Button>
            </div>
          </div>
        </form>
      </Card>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-start text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground"
      onClick={() => setIsAdding(true)}
    >
      <Plus className="mr-1 h-4 w-4" /> Add a card
    </Button>
  );
}
