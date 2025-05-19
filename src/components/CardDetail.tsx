
import { useState, useEffect } from 'react';
import { useBoard } from '@/context/BoardContext';
import { Card } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter
} from '@/components/ui/dialog';
import { CardDetailHeader } from './card-detail/CardDetailHeader';
import { CardLabels } from './card-detail/CardLabels';
import { CardDescription } from './card-detail/CardDescription';
import { CardDueDate } from './card-detail/CardDueDate';
import { CardAssignedUsers } from './card-detail/CardAssignedUsers';
import { CardAttachments } from './card-detail/CardAttachments';
import { CardChecklist } from './card-detail/CardChecklist';
import { CardComments } from './card-detail/CardComments';
import { CardActions } from './card-detail/CardActions';

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

  // Update card handler
  const handleUpdateCard = (updatedCard: Partial<Card>) => {
    updateCard(listId, {
      ...card,
      ...updatedCard
    });
  };

  // Handle actions that need specific card ID
  const handleDeleteLabel = (labelId: string) => {
    deleteLabel(listId, card.id, labelId);
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(listId, card.id, commentId);
  };

  const handleDeleteChecklist = (checklistId: string) => {
    deleteChecklist(listId, card.id, checklistId);
  };

  const handleAddChecklistItem = (checklistId: string, text: string) => {
    addChecklistItem(listId, card.id, checklistId, text);
  };

  const handleUpdateChecklistItem = (checklistId: string, itemId: string, checked: boolean) => {
    updateChecklistItem(listId, card.id, checklistId, itemId, checked);
  };

  const handleDeleteChecklistItem = (checklistId: string, itemId: string) => {
    deleteChecklistItem(listId, card.id, checklistId, itemId);
  };

  const handleAddComment = (text: string) => {
    addComment(listId, card.id, text, 'Current User'); // Replace with actual user name
  };

  const handleAddLabel = (name: string, color: string) => {
    addLabel(listId, card.id, name, color);
  };

  const handleAddChecklist = (title: string) => {
    addChecklist(listId, card.id, title);
  };

  const handleAddAttachment = (name: string, url: string, type: 'file' | 'link') => {
    addAttachment(listId, card.id, name, url, type);
  };

  const handleUpdateDueDate = (date?: Date) => {
    updateDueDate(listId, card.id, date);
  };

  const handleAssignUser = (userId: string) => {
    assignUser(listId, card.id, userId);
  };

  const handleUnassignUser = (userId: string) => {
    unassignUser(listId, card.id, userId);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    deleteAttachment(listId, card.id, attachmentId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <CardDetailHeader card={card} onSave={handleUpdateCard} />
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          <CardLabels 
            labels={card.labels || []} 
            onDeleteLabel={handleDeleteLabel} 
          />

          <CardDescription 
            description={card.description || ''} 
            onSave={handleUpdateCard} 
          />
          
          <CardDueDate 
            dueDate={card.dueDate} 
            onRemoveDueDate={() => handleUpdateDueDate(undefined)} 
          />

          <CardAssignedUsers 
            assignedUsers={card.assignedUsers} 
            availableUsers={availableUsers}
            onUnassignUser={handleUnassignUser} 
          />

          <CardAttachments 
            attachments={card.attachments} 
            onDeleteAttachment={handleDeleteAttachment} 
          />

          {card.checklists?.map(checklist => (
            <CardChecklist
              key={checklist.id}
              checklist={checklist}
              onDeleteChecklist={() => handleDeleteChecklist(checklist.id)}
              onAddItem={(text) => handleAddChecklistItem(checklist.id, text)}
              onUpdateItem={(itemId, checked) => handleUpdateChecklistItem(checklist.id, itemId, checked)}
              onDeleteItem={(itemId) => handleDeleteChecklistItem(checklist.id, itemId)}
            />
          ))}
          
          <CardComments 
            comments={card.comments} 
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>

        <DialogFooter className="mt-6 border-t pt-4 flex flex-col sm:flex-row gap-3">
          <div className="font-medium text-sm mb-2 w-full">Add to card</div>
          <CardActions 
            card={card}
            availableUsers={availableUsers}
            labelColors={labelColors}
            onAddLabel={handleAddLabel}
            onAddChecklist={handleAddChecklist}
            onUpdateDueDate={handleUpdateDueDate}
            onAssignUser={handleAssignUser}
            onAddAttachment={handleAddAttachment}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
