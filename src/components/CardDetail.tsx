
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useBoard } from '@/context/BoardContext';
import { Card, Label, Checklist, Comment, Attachment } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  MessageSquare, 
  ListChecks, 
  Tag, 
  Calendar as CalendarIcon,
  User,
  Paperclip,
  Link,
  Plus,
  X,
  Trash2
} from 'lucide-react';

interface CardDetailProps {
  card: Card;
  listId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CardDetail({ card, listId, open, onOpenChange }: CardDetailProps) {
  const { 
    updateCard,
    addComment,
    deleteComment,
    addChecklist,
    deleteChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    addLabel,
    deleteLabel,
    assignUser,
    unassignUser,
    updateDueDate,
    addAttachment,
    deleteAttachment
  } = useBoard();

  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [newComment, setNewComment] = useState('');
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [newItemTexts, setNewItemTexts] = useState<Record<string, string>>({});
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [newAttachmentName, setNewAttachmentName] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newAttachmentType, setNewAttachmentType] = useState<'file' | 'link'>('link');

  // Reset state when card changes
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
  }, [card]);

  // Example users (in a real app, these would come from a users context)
  const availableUsers = [
    { id: 'user-1', name: 'John Doe' },
    { id: 'user-2', name: 'Jane Smith' },
    { id: 'user-3', name: 'Bob Johnson' },
  ];

  // Label colors
  const labelColors = [
    'blue', 'green', 'red', 'yellow', 'purple', 'pink', 'orange'
  ];

  const handleSaveCard = () => {
    updateCard(listId, {
      ...card,
      title,
      description
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(listId, card.id, newComment, 'Current User'); // Replace with actual user name
      setNewComment('');
    }
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChecklistTitle.trim()) {
      addChecklist(listId, card.id, newChecklistTitle);
      setNewChecklistTitle('');
      setShowChecklistForm(false);
    }
  };

  const handleAddChecklistItem = (e: React.FormEvent, checklistId: string) => {
    e.preventDefault();
    const text = newItemTexts[checklistId];
    if (text?.trim()) {
      addChecklistItem(listId, card.id, checklistId, text);
      setNewItemTexts(prev => ({ ...prev, [checklistId]: '' }));
    }
  };

  const handleAddLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLabelName.trim()) {
      addLabel(listId, card.id, newLabelName, newLabelColor);
      setNewLabelName('');
      setShowLabelForm(false);
    }
  };

  const handleAssignUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserId) {
      assignUser(listId, card.id, newUserId);
      setNewUserId('');
      setShowUserForm(false);
    }
  };

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAttachmentName.trim() && newAttachmentUrl.trim()) {
      addAttachment(listId, card.id, newAttachmentName, newAttachmentUrl, newAttachmentType);
      setNewAttachmentName('');
      setNewAttachmentUrl('');
      setShowAttachmentForm(false);
    }
  };

  const calculateProgress = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter(item => item.checked).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="space-y-2">
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveCard}
              className="text-xl font-semibold border-none h-auto px-1 py-1 focus-visible:ring-0"
              placeholder="Card title"
            />
            <div className="text-xs text-muted-foreground">
              Created {format(new Date(card.created), 'MMM d, yyyy')}
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          <div className="flex flex-wrap gap-2">
            {card.labels?.map(label => (
              <div key={label.id} className="flex items-center">
                <Badge 
                  className={`bg-${label.color}-500 hover:bg-${label.color}-600`}
                >
                  {label.name}
                </Badge>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-5 w-5 ml-1" 
                  onClick={() => deleteLabel(listId, card.id, label.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="font-medium">Description</div>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveCard}
              className="min-h-[100px]"
              placeholder="Add a more detailed description..."
            />
          </div>
          
          {card.dueDate && (
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                Due date: {format(new Date(card.dueDate), 'MMM d, yyyy')}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5"
                onClick={() => updateDueDate(listId, card.id, undefined)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {card.assignedUsers && card.assignedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium">Assigned to</div>
              <div className="flex flex-wrap gap-2">
                {card.assignedUsers.map(userId => {
                  const user = availableUsers.find(u => u.id === userId);
                  return (
                    <div key={userId} className="flex items-center">
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <User className="h-3 w-3" />
                        {user?.name || userId}
                      </Badge>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-5 w-5 ml-1" 
                        onClick={() => unassignUser(listId, card.id, userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {card.attachments && card.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="font-medium">Attachments</div>
              <div className="space-y-2">
                {card.attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between border rounded-md p-2">
                    <div className="flex items-center gap-2">
                      {attachment.type === 'file' ? (
                        <Paperclip className="h-4 w-4" />
                      ) : (
                        <Link className="h-4 w-4" />
                      )}
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-7 w-7" 
                      onClick={() => deleteAttachment(listId, card.id, attachment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {card.checklists?.map(checklist => (
            <div key={checklist.id} className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{checklist.title}</div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground">
                    {calculateProgress(checklist)}%
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7" 
                    onClick={() => deleteChecklist(listId, card.id, checklist.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                {checklist.items.map(item => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked) => 
                        updateChecklistItem(listId, card.id, checklist.id, item.id, checked === true)
                      }
                      className="mt-1"
                    />
                    <div className={`text-sm flex-1 ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6" 
                      onClick={() => deleteChecklistItem(listId, card.id, checklist.id, item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <form onSubmit={(e) => handleAddChecklistItem(e, checklist.id)} className="mt-2 flex gap-2">
                <Input
                  value={newItemTexts[checklist.id] || ''}
                  onChange={(e) => setNewItemTexts({...newItemTexts, [checklist.id]: e.target.value})}
                  placeholder="Add an item"
                  className="text-sm"
                />
                <Button size="sm" type="submit">Add</Button>
              </form>
            </div>
          ))}

          {card.comments && card.comments.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <div className="font-medium">Comments</div>
              {card.comments.map(comment => (
                <div key={comment.id} className="space-y-1 pb-3 border-b">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">{comment.author}</div>
                    <div className="flex items-center">
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 ml-1" 
                        onClick={() => deleteComment(listId, card.id, comment.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment} className="mt-2 space-y-2">
            <div className="font-medium">Add Comment</div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[80px] text-sm"
            />
            <Button type="submit" className="w-full" disabled={!newComment.trim()}>Add Comment</Button>
          </form>
        </div>

        <DialogFooter className="mt-6 border-t pt-4 flex flex-col sm:flex-row gap-3">
          <div className="font-medium text-sm mb-2 w-full">Add to card</div>
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
                    if (date) {
                      updateDueDate(listId, card.id, date);
                    }
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
                      onClick={() => assignUser(listId, card.id, user.id)}
                      disabled={card.assignedUsers?.includes(user.id)}
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
                <Button variant="outline" size="sm" className="gap-2 justify-start">
                  <Paperclip className="h-4 w-4" /> Attachment
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

            <Button variant="outline" size="sm" className="gap-2 justify-start">
              <MessageSquare className="h-4 w-4" /> Comments
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
