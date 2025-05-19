
import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/types';
import { Input } from '@/components/ui/input';

interface CardDetailHeaderProps {
  title: string;
  onUpdateTitle: (title: string) => void;
}

export function CardDetailHeader({ title, onUpdateTitle }: CardDetailHeaderProps) {
  const [titleValue, setTitleValue] = useState(title);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };
  
  const handleTitleBlur = () => {
    onUpdateTitle(titleValue);
  };
  
  return (
    <div className="space-y-2">
      <Input 
        value={titleValue}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        className="text-xl font-semibold border-none h-auto px-1 py-1 focus-visible:ring-0"
        placeholder="Card title"
      />
    </div>
  );
}
