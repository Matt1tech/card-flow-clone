
import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { List, Card, BoardData } from '@/types';
import { toast } from "sonner";

// Initial sample data
const initialData: BoardData = {
  lists: [
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Learn React',
          description: 'Study hooks and context API',
          created: new Date(),
        },
        {
          id: 'card-2',
          title: 'Build a Trello clone',
          description: 'Create a kanban board with drag and drop',
          created: new Date(),
        },
      ],
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [
        {
          id: 'card-3',
          title: 'Create UI components',
          description: 'Design and implement reusable components',
          created: new Date(),
        },
      ],
    },
    {
      id: 'list-3',
      title: 'Done',
      cards: [
        {
          id: 'card-4',
          title: 'Setup project',
          description: 'Initialize project with Vite and install dependencies',
          created: new Date(),
        },
      ],
    },
  ],
};

interface BoardContextType {
  board: BoardData;
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, card: Omit<Card, 'id' | 'created'>) => void;
  updateCard: (listId: string, card: Card) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveCard: (cardId: string, sourceListId: string, targetListId: string, position: number) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<BoardData>(initialData);

  const addList = useCallback((title: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: [
        ...prev.lists,
        {
          id: `list-${Date.now()}`,
          title,
          cards: [],
        },
      ],
    }));
    toast.success("List added");
  }, []);

  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId ? { ...list, title } : list
      ),
    }));
    toast.success("List updated");
  }, []);

  const deleteList = useCallback((listId: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.filter((list) => list.id !== listId),
    }));
    toast.success("List deleted");
  }, []);

  const addCard = useCallback((listId: string, card: Omit<Card, 'id' | 'created'>) => {
    const newCard: Card = {
      ...card,
      id: `card-${Date.now()}`,
      created: new Date(),
    };

    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? { ...list, cards: [...list.cards, newCard] }
          : list
      ),
    }));
    toast.success("Card added");
  }, []);

  const updateCard = useCallback((listId: string, updatedCard: Card) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === updatedCard.id ? updatedCard : card
              ),
            }
          : list
      ),
    }));
    toast.success("Card updated");
  }, []);

  const deleteCard = useCallback((listId: string, cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            }
          : list
      ),
    }));
    toast.success("Card deleted");
  }, []);

  const moveCard = useCallback(
    (cardId: string, sourceListId: string, targetListId: string, position: number) => {
      setBoard((prev) => {
        // Find source list and card
        const sourceList = prev.lists.find((list) => list.id === sourceListId);
        if (!sourceList) return prev;

        const cardToMove = sourceList.cards.find((card) => card.id === cardId);
        if (!cardToMove) return prev;

        // Create new lists array with card removed from source
        const newLists = prev.lists.map((list) => {
          if (list.id === sourceListId) {
            return {
              ...list,
              cards: list.cards.filter((card) => card.id !== cardId),
            };
          }
          return list;
        });

        // Add card to target list at specified position
        return {
          ...prev,
          lists: newLists.map((list) => {
            if (list.id === targetListId) {
              const newCards = [...list.cards];
              newCards.splice(position, 0, cardToMove);
              return {
                ...list,
                cards: newCards,
              };
            }
            return list;
          }),
        };
      });

      // Only toast if moving between different lists to reduce noise
      if (sourceListId !== targetListId) {
        toast.success("Card moved");
      }
    },
    []
  );

  return (
    <BoardContext.Provider
      value={{
        board,
        addList,
        updateListTitle,
        deleteList,
        addCard,
        updateCard,
        deleteCard,
        moveCard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
