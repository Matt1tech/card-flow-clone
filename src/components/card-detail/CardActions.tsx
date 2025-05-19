
import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { 
  Tag, 
  ListChecks, 
  Calendar as CalendarIcon, 
  User, 
  Paperclip, 
  Link, 
  Plus, 
  MessageSquare,
  Upload
} from 'lucide-react';
import { toast } from "sonner";

interface CardActionsProps {
  card: {
    id: string;
    dueDate?: Date;
  };
  availableUsers: Array<{ id: string; name: string }>;
  labelColors: string[];
  onAddLabel: (name: string, color: string) => void;
  onAddChecklist: (title: string) => void;
  onUpdateDueDate: (date?: Date) => void;
  onAssignUser: (userId: string) => void;
  onAddAttachment: (name: string, url: string, type: 'file' | 'link') => void;
}

export function CardActions({
  card,
  availableUsers,
  labelColors,
  onAddLabel,
  onAddChecklist,
  onUpdateDueDate,
  onAssignUser,
  onAddAttachment
}: CardActionsProps) {
  // States for forms
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');
  
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<'file' | 'link'>('link');
  
  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Event handlers
  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      onAddLabel(newLabelName, newLabelColor);
      setNewLabelName('');
      setShowLabelForm(false);
    }
  };
  
  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      onAddChecklist(newChecklistTitle);
      setNewChecklistTitle('');
      setShowChecklistForm(false);
    }
  };
  
  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAttachmentName.trim() && newAttachmentUrl.trim()) {
      onAddAttachment(newAttachmentName, newAttachmentUrl, newAttachmentType);
      setNewAttachmentName('');
      setNewAttachmentUrl('');
      setShowAttachmentForm(false);
    }
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FileReader to convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileDataUrl = event.target?.result as string;
        if (fileDataUrl) {
          onAddAttachment(file.name, fileDataUrl, 'file');
          toast.success("File uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <Tag className="h-4 w-4" /> Labels
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Labels</h4>
            <div className="grid grid-cols-2 gap-2">
              {labelColors.map(color => (
                <Button 
                  key={color}
                  variant="ghost"
                  className={`bg-${color}-500 text-white justify-start hover:bg-${color}-600`}
                  onClick={() => {
                    setNewLabelColor(color);
                    setShowLabelForm(true);
                  }}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Button>
              ))}
            </div>
            
            {showLabelForm && (
              <form onSubmit={handleAddLabel} className="space-y-2 pt-2 border-t">
                <Input
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="Label name"
                  className="text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowLabelForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">Add</Button>
                </div>
              </form>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <ListChecks className="h-4 w-4" /> Checklist
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          {showChecklistForm ? (
            <form onSubmit={handleAddChecklist} className="space-y-2">
              <h4 className="font-medium">Add Checklist</h4>
              <Input
                value={newChecklistTitle}
                onChange={(e) => setNewChecklistTitle(e.target.value)}
                placeholder="Checklist title"
                className="text-sm"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowChecklistForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">Add</Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowChecklistForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Checklist
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <CalendarIcon className="h-4 w-4" /> Due Date
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={card.dueDate}
            onSelect={(date) => {
              onUpdateDueDate(date);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 justify-start">
            <User className="h-4 w-4" /> Members
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">Assign Members</h4>
            
            {availableUsers.map(user => (
              <Button 
                key={user.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onAssignUser(user.id)}
              >
                <User className="h-4 w-4 mr-2" />
                {user.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 justify-start items-center">
            <Paperclip className="h-4 w-4 flex-shrink-0" /> 
            <span className="truncate">Attachment</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-3">
            <h4 className="font-medium">Add Attachment</h4>
            
            <div className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleFileButtonClick}
              >
                <Upload className="h-4 w-4 mr-2" /> Upload File
              </Button>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf,text/*"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              
              {showAttachmentForm ? (
                <form onSubmit={handleAddAttachment} className="space-y-2">
                  <Input
                    value={newAttachmentName}
                    onChange={(e) => setNewAttachmentName(e.target.value)}
                    placeholder="Link title"
                    className="text-sm"
                  />
                  
                  <Input
                    value={newAttachmentUrl}
                    onChange={(e) => setNewAttachmentUrl(e.target.value)}
                    placeholder="URL"
                    className="text-sm"
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAttachmentForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={!newAttachmentName.trim() || !newAttachmentUrl.trim()}>
                      Add Link
                    </Button>
                  </div>
                </form>
              ) : (
                <Button 
                  onClick={() => {
                    setNewAttachmentType('link');
                    setShowAttachmentForm(true);
                  }} 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Link className="h-4 w-4 mr-2" /> Add Link
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" className="gap-2 justify-start items-center">
        <MessageSquare className="h-4 w-4 flex-shrink-0" /> 
        <span className="truncate">Comments</span>
      </Button>
    </div>
  );
}
