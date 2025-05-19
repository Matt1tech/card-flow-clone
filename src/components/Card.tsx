
import { useState, useRef, DragEvent } from 'react';
import { Card as CardType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card as CardUI } from '@/components/ui/card';
import { Pencil, Trash2, Calendar, Tag, ListChecks, Paperclip, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useBoard } from '@/context/BoardContext';
import CardDetail from './CardDetail';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => void;
}

export default function Card({ card, listId, index, onDragStart }: CardProps) {
  const { deleteCard } = useBoard();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  const handleDelete = () => {
    deleteCard(listId, card.id);
  };

  const handleCardClick = () => {
    setIsDetailOpen(true);
  };

  return (
    <>
      <CardUI 
        ref={cardRef}
        className="mb-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/60 dark:bg-card dark:border-l-primary/70"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-card-id={card.id}
        data-list-id={listId}
        data-card-index={index}
        onClick={handleCardClick}
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
                  setIsDetailOpen(true);
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
            <p className="text-muted-foreground text-xs line-clamp-2 mb-2">{card.description}</p>
          )}

          {card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.labels.map(label => (
                <Badge 
                  key={label.id} 
                  style={{ 
                    backgroundColor: `var(--${label.color}-500, #6b7280)`,
                    color: 'white'
                  }}
                  className="text-xs py-0 px-2 hover:opacity-90"
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
            {card.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(card.dueDate), 'MMM d')}</span>
              </div>
            )}
            
            {card.checklists && card.checklists.length > 0 && (
              <div className="flex items-center gap-1">
                <ListChecks className="h-3 w-3" />
                <span>
                  {card.checklists.reduce((total, list) => 
                    total + list.items.filter(item => item.checked).length, 0)}/
                  {card.checklists.reduce((total, list) => 
                    total + list.items.length, 0)}
                </span>
              </div>
            )}
            
            {card.comments && card.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{card.comments.length}</span>
              </div>
            )}
            
            {card.attachments && card.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{card.attachments.length}</span>
              </div>
            )}
          </div>
        </div>
      </CardUI>

      <CardDetail
        card={card}
        listId={listId}
        open={isDetailOpen} 
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
}
