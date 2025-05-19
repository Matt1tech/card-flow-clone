
import { useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  ListOrdered,
  ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';

interface CardDescriptionProps {
  description: string;
  onUpdateDescription: (description: string) => void;
}

export function CardDescription({ description, onUpdateDescription }: CardDescriptionProps) {
  const [value, setValue] = useState(description);
  const [isRTL, setIsRTL] = useState(false);
  
  useEffect(() => {
    setValue(description);
  }, [description]);
  
  const handleBlur = () => {
    onUpdateDescription(value);
  };

  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('editor');
    if (editor) {
      setValue(editor.innerHTML);
    }
  };
  
  const toggleRTL = () => {
    setIsRTL(!isRTL);
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.direction = !isRTL ? 'rtl' : 'ltr';
      editor.style.textAlign = !isRTL ? 'right' : 'left';
    }
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">Description</div>
      
      <div className="border rounded-md">
        <div className="bg-muted/30 p-1 flex flex-wrap items-center gap-1 border-b">
          <Toggle
            size="sm"
            aria-label="Toggle bold"
            onClick={() => formatText('bold')}
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            aria-label="Toggle italic"
            onClick={() => formatText('italic')}
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            aria-label="Toggle underline"
            onClick={() => formatText('underline')}
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Toggle
            size="sm"
            aria-label="Align left"
            onClick={() => formatText('justifyLeft')}
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            aria-label="Align center"
            onClick={() => formatText('justifyCenter')}
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            aria-label="Align right"
            onClick={() => formatText('justifyRight')}
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Toggle
            size="sm"
            aria-label="Ordered list"
            onClick={() => formatText('insertOrderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="sm"
            aria-label="Unordered list"
            onClick={() => formatText('insertUnorderedList')}
          >
            <ListChecks className="h-4 w-4" />
          </Toggle>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleRTL}
            className="text-xs"
          >
            {isRTL ? 'LTR' : 'RTL'}
          </Button>
        </div>
        
        <div
          id="editor"
          className="min-h-[100px] p-3 focus:outline-none"
          contentEditable
          dangerouslySetInnerHTML={{ __html: value }}
          onBlur={handleBlur}
          onInput={(e) => setValue((e.target as HTMLDivElement).innerHTML)}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
}
