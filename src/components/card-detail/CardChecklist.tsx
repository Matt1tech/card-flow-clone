
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checklist } from '@/types';
import { Trash2 } from 'lucide-react';
import { CardChecklistItem } from './CardChecklistItem';

interface CardChecklistProps {
  checklist: Checklist;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
  onDeleteChecklist: () => void;
  onAddItem: (text: string) => void;
  onUpdateItem: (itemId: string, checked: boolean) => void;
  onToggleItem: (itemId: string, checked: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

export function CardChecklist({ 
  checklist,
  isEditing,
  onStartEditing,
  onStopEditing,
  onDeleteChecklist,
  onAddItem,
  onUpdateItem,
  onToggleItem, 
  onDeleteItem 
}: CardChecklistProps) {
  const [newItemText, setNewItemText] = useState('');
  
  const calculateProgress = () => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.checked).length;
    return Math.round((completed / checklist.items.length) * 100);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onAddItem(newItemText);
      setNewItemText('');
    }
  };
  
  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">{checklist.title}</div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {calculateProgress()}%
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={onDeleteChecklist}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-1">
        {checklist.items.map(item => (
          <CardChecklistItem
            key={item.id}
            id={item.id}
            text={item.text}
            checked={item.checked}
            onToggle={(checked) => onToggleItem(item.id, checked)}
            onDelete={() => onDeleteItem(item.id)}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add an item"
          className="text-sm"
        />
        <Button size="sm" type="submit">Add</Button>
      </form>
    </div>
  );
}
