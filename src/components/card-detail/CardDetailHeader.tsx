
import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/types';
import { Input } from '@/components/ui/input';

interface CardDetailHeaderProps {
  card: Card;
  onSave: (updatedCard: Partial<Card>) => void;
}

export function CardDetailHeader({ card, onSave }: CardDetailHeaderProps) {
  const [title, setTitle] = useState(card.title);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleTitleBlur = () => {
    onSave({ title });
  };
  
  return (
    <div className="space-y-2">
      <Input 
        value={title}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        className="text-xl font-semibold border-none h-auto px-1 py-1 focus-visible:ring-0"
        placeholder="Card title"
      />
      <div className="text-xs text-muted-foreground">
        Created {format(new Date(card.created), 'MMM d, yyyy')}
      </div>
    </div>
  );
}
