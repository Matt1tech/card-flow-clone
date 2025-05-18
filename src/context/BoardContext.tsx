import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";
import { List, Card } from '@/types';

// Interface for the board data
interface BoardData {
  lists: List[];
}

interface BoardContextType {
  lists: List[];
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, title: string, description: string) => void;
  updateCard: (listId: string, cardId: string, title: string, description: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveCard: (fromListId: string, toListId: string, cardId: string) => void;
}

// Initial state for the board context
const initialBoardData: BoardData = {
  lists: [
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Research competitors',
          description: 'Look at similar products and identify strengths and weaknesses',
          created: new Date()
        },
        {
          id: 'card-2',
          title: 'Sketch wireframes',
          description: 'Create rough layouts for key screens',
          created: new Date()
        }
      ]
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [
        {
          id: 'card-3',
          title: 'Design style guide',
          description: 'Define colors, typography, and component styles',
          created: new Date()
        }
      ]
    },
    {
      id: 'list-3',
      title: 'Done',
      cards: [
        {
          id: 'card-4',
          title: 'Project setup',
          description: 'Initialize repository and configure development environment',
          created: new Date()
        }
      ]
    }
  ]
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<BoardData>(initialBoardData);

  const addList = (title: string) => {
    const newList: List = {
      id: `list-${Date.now()}`,
      title,
      cards: [],
    };
    setBoard(prevBoard => ({ ...prevBoard, lists: [...prevBoard.lists, newList] }));
    toast.success("List added");
  };

  const updateListTitle = (listId: string, title: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list =>
        list.id === listId ? { ...list, title } : list
      ),
    }));
    toast.success("List updated");
  };

  const deleteList = (listId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.filter(list => list.id !== listId),
    }));
    toast.success("List deleted");
  };

  const addCard = (listId: string, title: string, description: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title,
      description,
      created: new Date(),
    };
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
    }));
    toast.success("Card added");
  };

  const updateCard = (listId: string, cardId: string, title: string, description: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card.id === cardId ? { ...card, title, description } : card
        ),
      })),
    }));
    toast.success("Card updated");
  };

  const deleteCard = (listId: string, cardId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => card.id !== cardId),
      })),
    }));
    toast.success("Card deleted");
  };

  const moveCard = (fromListId: string, toListId: string, cardId: string) => {
    setBoard(prevBoard => {
      let cardToMove: Card | undefined;
      const updatedLists = prevBoard.lists.map(list => {
        // Remove card from the original list
        if (list.id === fromListId) {
          cardToMove = list.cards.find(card => card.id === cardId);
          return { ...list, cards: list.cards.filter(card => card.id !== cardId) };
        }
        return list;
      });

      // Add card to the destination list
      if (cardToMove) {
        const finalLists = updatedLists.map(list => {
          if (list.id === toListId) {
            return { ...list, cards: [...list.cards, cardToMove!] };
          }
          return list;
        });
        return { ...prevBoard, lists: finalLists };
      }

      return prevBoard;
    });
    toast.success("Card moved");
  };

  return (
    <BoardContext.Provider
      value={{
        lists: board.lists,
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
