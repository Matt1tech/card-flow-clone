
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, Tag, UserPlus, Paperclip, Image } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CoverSelector from "../covers/CoverSelector";
import { Cover } from "@/types";

interface CardActionsProps {
  onAddLabel: () => void;
  onAddChecklist: () => void;
  onAddDueDate: () => void;
  onAddAttachment: (name: string, url: string, type: 'file' | 'link') => void;
  onAssignUser: () => void;
  onAddCover: (cover: Cover) => void;
  onRemoveCover: () => void;
  currentCover?: Cover;
}

export function CardActions({
  onAddLabel,
  onAddChecklist,
  onAddDueDate,
  onAddAttachment,
  onAssignUser,
  onAddCover,
  onRemoveCover,
  currentCover
}: CardActionsProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a readable name
    const fileName = file.name;
    
    // Convert file to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onAddAttachment(fileName, dataUrl, 'file');
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onAddLabel} className="flex items-center gap-1">
        <Tag className="h-4 w-4" />
        <span className="hidden md:inline">Labels</span>
      </Button>
      
      <Button variant="outline" size="sm" onClick={onAddChecklist} className="flex items-center gap-1">
        <ListTodo className="h-4 w-4" />
        <span className="hidden md:inline">Checklist</span>
      </Button>
      
      <Button variant="outline" size="sm" onClick={onAddDueDate} className="flex items-center gap-1">
        <Calendar className="h-4 w-4" />
        <span className="hidden md:inline">Due Date</span>
      </Button>
      
      <Button variant="outline" size="sm" onClick={onAssignUser} className="flex items-center gap-1">
        <UserPlus className="h-4 w-4" />
        <span className="hidden md:inline">Assign</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Paperclip className="h-4 w-4" />
        <span className="hidden md:inline">Attachment</span>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            <span className="hidden md:inline">Cover</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <CoverSelector
            currentCover={currentCover}
            onSelectCover={onAddCover}
            onRemoveCover={onRemoveCover}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
