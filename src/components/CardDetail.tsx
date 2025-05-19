import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBoard } from '@/context/BoardContext';
import { Card, Checklist, Label, Cover } from '@/types';
import { CardDetailHeader } from './card-detail/CardDetailHeader';
import { CardDescription } from './card-detail/CardDescription';
import { CardActions } from './card-detail/CardActions';
import { CardLabels } from './card-detail/CardLabels';
import { CardDueDate } from './card-detail/CardDueDate';
import { CardChecklist } from './card-detail/CardChecklist';
import { CardComments } from './card-detail/CardComments';
import { CardAssignedUsers } from './card-detail/CardAssignedUsers';
import { CardAttachments } from './card-detail/CardAttachments';

import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';

export default function CardDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const cardId = searchParams.get('cardId');
  const listId = searchParams.get('listId');
  
  const { 
    lists, 
    updateCard, 
    addLabel, 
    deleteLabel, 
    addComment, 
    deleteComment,
    addChecklist,
    deleteChecklist,
    addChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
    updateDueDate,
    addAttachment,
    deleteAttachment,
    updateCardCover
  } = useBoard();
  
  const [card, setCard] = useState<Card | null>(null);
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<string | null>(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showAssignUsers, setShowAssignUsers] = useState(false);
  
  useEffect(() => {
    if (listId && cardId) {
      const foundList = lists.find(l => l.id === listId);
      if (foundList) {
        const foundCard = foundList.cards.find(c => c.id === cardId);
        if (foundCard) {
          setCard(foundCard);
        }
      }
    }
  }, [lists, listId, cardId]);
  
  const handleClose = () => {
    setSearchParams({});
  };
  
  // Update card wrapper
  const updateCurrentCard = (updatedFields: Partial<Card>) => {
    if (card && listId) {
      const updatedCard = { ...card, ...updatedFields };
      updateCard(listId, updatedCard);
      setCard(updatedCard);
    }
  };
  
  // Add/remove label handlers
  const handleAddLabel = (name: string, color: string) => {
    if (card && listId) {
      addLabel(listId, card.id, name, color);
    }
  };
  
  const handleDeleteLabel = (labelId: string) => {
    if (card && listId) {
      deleteLabel(listId, card.id, labelId);
    }
  };
  
  // Add/remove comment handlers
  const handleAddComment = (text: string, author: string = "You") => {
    if (card && listId) {
      addComment(listId, card.id, text, author);
    }
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (card && listId) {
      deleteComment(listId, card.id, commentId);
    }
  };
  
  // Checklist handlers
  const handleAddChecklist = (title: string) => {
    if (card && listId) {
      addChecklist(listId, card.id, title);
      setShowAddChecklist(false);
    }
  };
  
  const handleDeleteChecklist = (checklistId: string) => {
    if (card && listId) {
      deleteChecklist(listId, card.id, checklistId);
    }
  };
  
  const handleAddChecklistItem = (checklistId: string, text: string) => {
    if (card && listId) {
      addChecklistItem(listId, card.id, checklistId, text);
    }
  };
  
  const handleToggleChecklistItem = (checklistId: string, itemId: string, checked: boolean) => {
    if (card && listId) {
      updateChecklistItem(listId, card.id, checklistId, itemId, checked);
    }
  };
  
  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    if (card && listId) {
      deleteChecklistItem(listId, card.id, checklistId, itemId);
    }
  };
  
  const handleUpdateDueDate = (date: Date | undefined) => {
    if (card && listId) {
      updateDueDate(listId, card.id, date);
      setShowDueDatePicker(false);
    }
  };
  
  const handleAddAttachment = (name: string, url: string, type: 'file' | 'link') => {
    if (card && listId) {
      addAttachment(listId, card.id, name, url, type);
    }
  };
  
  const handleDeleteAttachment = (attachmentId: string) => {
    if (card && listId) {
      deleteAttachment(listId, card.id, attachmentId);
    }
  };

  const handleAddCover = (cover: Cover) => {
    if (card && listId) {
      updateCardCover(listId, card.id, cover);
    }
  };

  const handleRemoveCover = () => {
    if (card && listId) {
      updateCardCover(listId, card.id, undefined);
    }
  };
  
  // Handle removing due date
  const handleRemoveDueDate = () => {
    if (card && listId) {
      updateDueDate(listId, card.id, undefined);
    }
  };

  // Render the card cover if available
  const renderCover = () => {
    if (!card?.cover) return null;
    
    if (card.cover.url) {
      return (
        <div 
          className="w-full h-48 bg-cover bg-center rounded-t-md -mt-6 -mx-6 mb-6"
          style={{ backgroundImage: `url(${card.cover.url})` }}
        />
      );
    } else if (card.cover.color) {
      return (
        <div 
          className="w-full h-24 rounded-t-md -mt-6 -mx-6 mb-6"
          style={{ backgroundColor: card.cover.color }}
        />
      );
    }
    
    return null;
  };

  if (!card || !listId) {
    return null;
  }
  
  return (
    <Dialog open={!!cardId && !!listId} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          {renderCover()}
          <CardDetailHeader
            title={card.title}
            onUpdateTitle={(title) => updateCurrentCard({ title })}
          />
        </DialogHeader>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-6">
            <CardDescription
              description={card.description}
              onUpdateDescription={(description) => updateCurrentCard({ description })}
            />
            
            {showAddLabel && (
              <CardLabels
                labels={card.labels || []}
                onAddLabel={handleAddLabel}
                onDeleteLabel={handleDeleteLabel}
                onClose={() => setShowAddLabel(false)}
              />
            )}
            
            {showDueDatePicker && (
              <CardDueDate
                dueDate={card.dueDate}
                onUpdateDueDate={handleUpdateDueDate}
                onRemoveDueDate={handleRemoveDueDate}
                onClose={() => setShowDueDatePicker(false)}
              />
            )}
            
            {card.checklists?.map((checklist: Checklist) => (
              <CardChecklist
                key={checklist.id}
                checklist={checklist}
                isEditing={editingChecklist === checklist.id}
                onStartEditing={() => setEditingChecklist(checklist.id)}
                onStopEditing={() => setEditingChecklist(null)}
                onAddItem={(text) => handleAddChecklistItem(checklist.id, text)}
                onToggleItem={(itemId, checked) => handleToggleChecklistItem(checklist.id, itemId, checked)}
                onUpdateItem={(itemId, checked) => handleToggleChecklistItem(checklist.id, itemId, checked)}
                onDeleteItem={(itemId) => handleDeleteChecklistItem(checklist.id, itemId)}
                onDeleteChecklist={() => handleDeleteChecklist(checklist.id)}
              />
            ))}
            
            {card.attachments && card.attachments.length > 0 && (
              <CardAttachments
                attachments={card.attachments}
                onDeleteAttachment={handleDeleteAttachment}
              />
            )}
            
            <CardComments
              comments={card.comments || []}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Add to card</h3>
              <CardActions
                onAddLabel={() => setShowAddLabel(true)}
                onAddChecklist={() => setShowAddChecklist(true)}
                onAddDueDate={() => setShowDueDatePicker(true)}
                onAddAttachment={handleAddAttachment}
                onAssignUser={() => setShowAssignUsers(true)}
                onAddCover={handleAddCover}
                onRemoveCover={handleRemoveCover}
                currentCover={card.cover}
              />
            </div>
            
            {card.labels && card.labels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Labels</h3>
                <div className="flex flex-wrap gap-1">
                  {card.labels.map(label => (
                    <div 
                      key={label.id} 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: label.color }}
                    >
                      {label.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {card.dueDate && (
              <div>
                <h3 className="text-sm font-medium mb-2">Due Date</h3>
                <div className="text-sm">
                  {new Date(card.dueDate).toLocaleDateString(undefined, { 
                    weekday: 'short',
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            )}
            
            {card.assignedUsers && card.assignedUsers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Members</h3>
                <CardAssignedUsers
                  assignedUsers={card.assignedUsers}
                  onAssignUser={() => {}}
                  onUnassignUser={() => {}}
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
