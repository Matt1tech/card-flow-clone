
import { useState, useRef, DragEvent } from 'react';
import { useBoard } from '@/context/BoardContext';
import List from './List';
import AddList from './AddList';

export default function Board() {
  const { lists, moveCard } = useBoard();
  const [dragCard, setDragCard] = useState<{ cardId: string; sourceListId: string } | null>(null);
  const dragOverListId = useRef<string | null>(null);
  const dragOverCardIndex = useRef<number | null>(null);
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => {
    setDragCard({ cardId, sourceListId: listId });
    // Set the drag image and data
    e.dataTransfer.setData('text/plain', cardId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const targetListElement = findClosestListElement(e.target as HTMLElement);
    if (!targetListElement) return;
    
    const targetListId = targetListElement.getAttribute('data-list-id');
    if (!targetListId || dragOverListId.current === targetListId) return;
    
    dragOverListId.current = targetListId;
    
    // Clear any previous drag-over class from card elements
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    const targetCardElement = findClosestCardElement(e.target as HTMLElement, targetListId);
    if (targetCardElement) {
      targetCardElement.classList.add('drag-over');
      dragOverCardIndex.current = parseInt(targetCardElement.getAttribute('data-card-index') || '-1');
    } else {
      // No cards in list, or dragging at the end of the list
      dragOverCardIndex.current = -1;
    }
  };

  const findClosestListElement = (element: HTMLElement): HTMLElement | null => {
    while (element && !element.getAttribute('data-list-id')) {
      element = element.parentElement as HTMLElement;
      if (!element || element === document.body) return null;
    }
    return element;
  };

  const findClosestCardElement = (element: HTMLElement, listId: string): HTMLElement | null => {
    // First check if we're directly over a card
    while (element) {
      if (element.getAttribute('data-card-id') && element.getAttribute('data-list-id') === listId) {
        return element;
      }
      if (element === document.body) break;
      element = element.parentElement as HTMLElement;
    }
    return null;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, listId: string) => {
    e.preventDefault();
    
    // Clear any drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    if (!dragCard) return;
    
    const targetCardIndex = dragOverCardIndex.current !== null 
      ? dragOverCardIndex.current 
      : lists.find(l => l.id === listId)?.cards.length || 0;
    
    // Only move if we have valid source and target
    if (dragCard.cardId && dragCard.sourceListId && listId) {
      moveCard(dragCard.cardId, dragCard.sourceListId, listId, targetCardIndex >= 0 ? targetCardIndex : 0);
    }
    
    // Reset drag state
    setDragCard(null);
    dragOverListId.current = null;
    dragOverCardIndex.current = null;
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <div className="flex space-x-4 items-start h-full">
        {lists.map((list) => (
          <List 
            key={list.id} 
            list={list} 
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
        <AddList />
      </div>
    </div>
  );
}
