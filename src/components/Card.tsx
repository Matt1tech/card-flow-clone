
import { useState, useRef, DragEvent } from 'react';
import { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card as CardUI } from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useBoard } from '@/context/BoardContext';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => void;
}

export default function Card({ card, listId, index, onDragStart }: CardProps) {
  const { updateCard, deleteCard } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editDescription, setEditDescription] = useState(card.description);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    onDragStart(e, card.id, listId);
    
    // Add some delay to allow the drag image to be set up properly
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add('opacity-50');
      }
    }, 0);
  };

  const handleDragEnd = () => {
    if (cardRef.current) {
      cardRef.current.classList.remove('opacity-50');
    }
  };

  const handleSaveEdit = () => {
    updateCard(listId, {
      ...card,
      title: editTitle,
      description: editDescription,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteCard(listId, card.id);
  };

  return (
    <>
      <CardUI 
        ref={cardRef}
        className="mb-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/60"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-card-id={card.id}
        data-list-id={listId}
        data-card-index={index}
      >
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm mb-1">{card.title}</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-destructive hover:text-destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          {card.description && (
            <p className="text-muted-foreground text-xs line-clamp-2">{card.description}</p>
          )}
        </div>
      </CardUI>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editTitle.trim()}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
