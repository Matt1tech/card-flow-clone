
import { useState, DragEvent } from 'react';
import { List as ListType } from '@/types';
import { Card as CardUI } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, MoreHorizontal, Trash2, GripHorizontal, Image, X } from 'lucide-react';
import CardComponent from './Card';
import AddCard from './AddCard';
import { useBoard } from '@/context/BoardContext';
import CoverSelector from './covers/CoverSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface ListProps {
  list: ListType;
  onDragStart: (e: DragEvent<HTMLDivElement>, cardId: string, listId: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>, listId: string) => void;
}

export default function List({ list, onDragStart, onDragOver, onDrop }: ListProps) {
  const { updateListTitle, deleteList, updateListCover } = useBoard();
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

  const handleCoverSelect = (cover: { url: string, color?: string }) => {
    updateListCover(list.id, cover);
  };

  const handleRemoveCover = () => {
    updateListCover(list.id, undefined);
  };

  const renderCover = () => {
    if (!list.cover) return null;
    
    const coverStyle = list.cover.url 
      ? { backgroundImage: `url(${list.cover.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: list.cover.color };
    
    return (
      <div 
        className="w-full h-24 relative" 
        style={coverStyle}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 bg-black/20 hover:bg-black/40 text-white h-6 w-6 rounded-full"
          onClick={handleRemoveCover}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  return (
    <CardUI className="flex flex-col w-full bg-muted/40 dark:bg-muted/10 shadow-sm h-full max-h-[calc(100vh-10rem)] overflow-hidden">
      {renderCover()}
      
      <div className="p-3 flex items-center justify-between border-b dark:border-border">
        <div className="flex items-center gap-2 flex-1">
          <div className="cursor-move">
            <GripHorizontal className="h-4 w-4 text-muted-foreground" />
          </div>
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
        </div>
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
              <Popover>
                <PopoverTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Image className="mr-2 h-4 w-4" /> Change Cover
                  </DropdownMenuItem>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <CoverSelector
                    currentCover={list.cover}
                    onSelectCover={handleCoverSelect}
                    onRemoveCover={handleRemoveCover}
                  />
                </PopoverContent>
              </Popover>
              <DropdownMenuSeparator />
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
