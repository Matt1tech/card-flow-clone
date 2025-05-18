
import React, { useState, useRef, DragEvent } from 'react';
import { useBoard } from '@/context/BoardContext';
import List from './List';
import AddList from './AddList';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export default function Board() {
  const { lists, moveCard } = useBoard();
  const [dragCard, setDragCard] = useState<{ cardId: string; sourceListId: string } | null>(null);
  const dragOverListId = useRef<string | null>(null);
  const dragOverCardIndex = useRef<number | null>(null);
  
  // New state for list dragging
  const [draggedList, setDraggedList] = useState<string | null>(null);
  const [listsOrder, setListsOrder] = useState<string[]>(() => lists.map(list => list.id));
  
  const handleDragStart = (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => {
    setDragCard({ cardId, sourceListId: listId });
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

  // List drag handlers
  const handleListDragStart = (e: DragEvent<HTMLDivElement>, listId: string) => {
    setDraggedList(listId);
    e.dataTransfer.setData('text/plain', listId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add styling to show it's being dragged
    if (e.currentTarget) {
      e.currentTarget.classList.add('opacity-50');
    }
  };
  
  const handleListDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleListDrop = (e: DragEvent<HTMLDivElement>, targetListId: string) => {
    e.preventDefault();
    
    if (draggedList && draggedList !== targetListId) {
      const newOrder = [...listsOrder];
      const dragIndex = newOrder.indexOf(draggedList);
      const dropIndex = newOrder.indexOf(targetListId);
      
      if (dragIndex !== -1 && dropIndex !== -1) {
        // Remove from old position and insert at new position
        newOrder.splice(dragIndex, 1);
        newOrder.splice(dropIndex, 0, draggedList);
        setListsOrder(newOrder);
      }
    }
    
    setDraggedList(null);
    
    // Remove drag styling
    document.querySelectorAll('.list-container').forEach(el => {
      el.classList.remove('opacity-50');
    });
  };
  
  const handleListDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedList(null);
    
    // Remove drag styling
    if (e.currentTarget) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };

  // Sort the lists according to the current order
  const sortedLists = [...lists].sort((a, b) => {
    const aIndex = listsOrder.indexOf(a.id);
    const bIndex = listsOrder.indexOf(b.id);
    return aIndex - bIndex;
  });

  return (
    <div className="flex-1 overflow-x-auto p-6 bg-background dark:bg-background">
      <div className="flex items-start h-full">
        <ResizablePanelGroup direction="horizontal" className="flex space-x-4 items-start h-full">
          {sortedLists.map((list, index) => (
            <React.Fragment key={list.id}>
              <ResizablePanel 
                defaultSize={20}
                minSize={15}
                className="list-container"
                data-list-id={list.id}
                draggable
                onDragStart={(e) => handleListDragStart(e as unknown as DragEvent<HTMLDivElement>, list.id)}
                onDragOver={(e) => handleListDragOver(e as unknown as DragEvent<HTMLDivElement>)}
                onDrop={(e) => handleListDrop(e as unknown as DragEvent<HTMLDivElement>, list.id)}
                onDragEnd={(e) => handleListDragEnd(e as unknown as DragEvent<HTMLDivElement>)}
              >
                <List 
                  list={list} 
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </ResizablePanel>
              {index < sortedLists.length - 1 && (
                <ResizableHandle withHandle />
              )}
            </React.Fragment>
          ))}
          <div className="ml-4 flex-shrink-0">
            <AddList />
          </div>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
