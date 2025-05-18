
import { useState, DragEvent } from 'react';
import { List as ListType } from '@/types';
import { Card as CardUI } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, MoreHorizontal, Trash2 } from 'lucide-react';
import CardComponent from './Card';
import AddCard from './AddCard';
import { useBoard } from '@/context/BoardContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ListProps {
  list: ListType;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, listId: string) => void;
}

export default function List({ list, onDragStart, onDragOver, onDrop }: ListProps) {
  const { updateListTitle, deleteList } = useBoard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    onDrop(e, list.id);
  };

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      updateListTitle(list.id, title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteList = () => {
    deleteList(list.id);
  };

  return (
    <CardUI className="flex flex-col w-72 bg-muted/40 shadow-sm h-full max-h-[calc(100vh-10rem)] overflow-hidden">
      <div className="p-3 flex items-center justify-between border-b">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              className="py-1 h-7 text-sm font-medium"
              autoFocus
            />
          </form>
        ) : (
          <div 
            className="flex-1 text-sm font-medium cursor-pointer"
            onClick={() => setIsEditingTitle(true)}
          >
            {list.title}
          </div>
        )}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsEditingTitle(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleDeleteList}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete List
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div 
        className="flex-1 overflow-y-auto p-2 space-y-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-list-id={list.id}
      >
        {list.cards.map((card, index) => (
          <CardComponent 
            key={card.id} 
            card={card} 
            listId={list.id}
            index={index} 
            onDragStart={(e) => onDragStart(e, card.id, list.id)} 
          />
        ))}
      </div>
      
      <div className="p-2 mt-auto">
        <AddCard listId={list.id} />
      </div>
    </CardUI>
  );
}
