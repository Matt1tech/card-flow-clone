import { useState } from 'react';
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
  MessageSquare 
} from 'lucide-react';

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
          {showAttachmentForm ? (
            <form onSubmit={handleAddAttachment} className="space-y-2">
              <h4 className="font-medium">Add Attachment</h4>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={newAttachmentType === 'link' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNewAttachmentType('link')}
                >
                  <Link className="h-4 w-4 mr-2" /> Link
                </Button>
                <Button 
                  type="button" 
                  variant={newAttachmentType === 'file' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setNewAttachmentType('file')}
                >
                  <Paperclip className="h-4 w-4 mr-2" /> File
                </Button>
              </div>
              
              <Input
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                placeholder="Name"
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
                  Add
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setShowAttachmentForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Add Attachment
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" className="gap-2 justify-start items-center">
        <MessageSquare className="h-4 w-4 flex-shrink-0" /> 
        <span className="truncate">Comments</span>
      </Button>
    </div>
  );
}
