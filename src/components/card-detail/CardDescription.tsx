
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/types';

interface CardDescriptionProps {
  description: string;
  onSave: (updatedCard: Partial<Card>) => void;
}

export function CardDescription({ description, onSave }: CardDescriptionProps) {
  const [value, setValue] = useState(description);
  
  useEffect(() => {
    setValue(description);
  }, [description]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  
  const handleBlur = () => {
    onSave({ description: value });
  };
  
  return (
    <div className="space-y-2">
      <div className="font-medium">Description</div>
      <Textarea 
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="min-h-[100px]"
        placeholder="Add a more detailed description..."
      />
    </div>
  );
}
