
import { Card as CardType } from '@/types';
import { Card as CardUI } from '@/components/ui/card';
import { DragEvent } from 'react';
import { Clock, CheckSquare, MessageSquare, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
}

export default function Card({ card, listId, index, onDragStart }: CardProps) {
  const navigate = useNavigate();
  
  const completedItems = card.checklists?.flatMap(list => 
    list.items.filter(item => item.checked)
  ).length || 0;
  
  const totalItems = card.checklists?.flatMap(list => list.items).length || 0;
  
  const commentsCount = card.comments?.length || 0;
  const attachmentsCount = card.attachments?.length || 0;
  
  const handleCardClick = () => {
    navigate(`?cardId=${card.id}&listId=${listId}`);
  };
  
  // Render the card cover if available
  const renderCover = () => {
    if (!card.cover) return null;
    
    if (card.cover.url) {
      return (
        <div 
          className="w-full h-32 rounded-t-md bg-cover bg-center"
          style={{ backgroundImage: `url(${card.cover.url})` }}
        />
      );
    } else if (card.cover.color) {
      return (
        <div 
          className="w-full h-8 rounded-t-md"
          style={{ backgroundColor: card.cover.color }}
        />
      );
    }
    
    return null;
  };
  
  return (
    <CardUI
      className="cursor-pointer hover:shadow-md transition-shadow bg-card"
      data-card-id={card.id}
      data-list-id={listId}
      data-card-index={index}
      draggable
      onDragStart={onDragStart}
      onClick={handleCardClick}
    >
      {renderCover()}
      
      <div className="p-3 space-y-2">
        {card.labels && card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {card.labels.map(label => (
              <div 
                key={label.id} 
                className="h-2 w-12 rounded-full" 
                style={{ backgroundColor: label.color }}
                title={label.name}
              />
            ))}
          </div>
        )}
        
        <h3 className="font-medium text-sm">{card.title}</h3>
        
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          {card.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {new Date(card.dueDate).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
          
          {totalItems > 0 && (
            <div className="flex items-center gap-1">
              <CheckSquare className="h-3 w-3" />
              <span>{completedItems}/{totalItems}</span>
            </div>
          )}
          
          {commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{commentsCount}</span>
            </div>
          )}
          
          {attachmentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              <span>{attachmentsCount}</span>
            </div>
          )}
        </div>
      </div>
    </CardUI>
  );
}
