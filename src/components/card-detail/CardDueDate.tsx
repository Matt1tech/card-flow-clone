
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';

interface CardDueDateProps {
  dueDate?: Date;
  onRemoveDueDate: () => void;
}

export function CardDueDate({ dueDate, onRemoveDueDate }: CardDueDateProps) {
  if (!dueDate) return null;
  
  return (
    <div className="flex items-center space-x-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      <div className="text-sm">
        Due date: {format(new Date(dueDate), 'MMM d, yyyy')}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-5 w-5"
        onClick={onRemoveDueDate}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
