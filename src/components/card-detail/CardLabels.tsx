
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/types';
import { X } from 'lucide-react';
import { useTheme } from '@/context/theme/ThemeContext';

interface CardLabelsProps {
  labels: Label[];
  onDeleteLabel: (labelId: string) => void;
}

export function CardLabels({ labels, onDeleteLabel }: CardLabelsProps) {
  const { theme } = useTheme();
  
  if (!labels || labels.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map(label => (
        <div key={label.id} className="flex items-center">
          <Badge 
            className={`bg-${label.color}-500 hover:bg-${label.color}-600 ${theme === 'light' ? 'text-black' : 'text-white'}`}
          >
            {label.name}
          </Badge>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-5 w-5 ml-1" 
            onClick={() => onDeleteLabel(label.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
