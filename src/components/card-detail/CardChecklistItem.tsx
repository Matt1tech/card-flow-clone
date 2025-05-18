
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface CardChecklistItemProps {
  id: string;
  text: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onDelete: () => void;
}

export function CardChecklistItem({ id, text, checked, onToggle, onDelete }: CardChecklistItemProps) {
  return (
    <div className="flex items-start gap-2">
      <Checkbox
        checked={checked}
        onCheckedChange={(checked) => onToggle(checked === true)}
        className="mt-1"
      />
      <div className={`text-sm flex-1 ${checked ? 'line-through text-muted-foreground' : ''}`}>
        {text}
      </div>
      <Button 
        size="icon" 
        variant="ghost" 
        className="h-6 w-6" 
        onClick={onDelete}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
