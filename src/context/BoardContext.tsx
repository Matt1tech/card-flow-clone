import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from "sonner";
import { List, Card, Comment, ChecklistItem, Checklist, Label, Attachment, Cover } from '@/types';

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
  updateCard: (listId: string, card: Card) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveCard: (cardId: string, fromListId: string, toListId: string, newIndex?: number) => void;
  
  // New methods for card details
  addComment: (listId: string, cardId: string, text: string, author: string) => void;
  deleteComment: (listId: string, cardId: string, commentId: string) => void;
  
  addChecklist: (listId: string, cardId: string, title: string) => void;
  deleteChecklist: (listId: string, cardId: string, checklistId: string) => void;
  
  addChecklistItem: (listId: string, cardId: string, checklistId: string, text: string) => void;
  updateChecklistItem: (listId: string, cardId: string, checklistId: string, itemId: string, checked: boolean) => void;
  deleteChecklistItem: (listId: string, cardId: string, checklistId: string, itemId: string) => void;
  
  addLabel: (listId: string, cardId: string, name: string, color: string) => void;
  deleteLabel: (listId: string, cardId: string, labelId: string) => void;
  
  assignUser: (listId: string, cardId: string, userId: string) => void;
  unassignUser: (listId: string, cardId: string, userId: string) => void;
  
  updateDueDate: (listId: string, cardId: string, dueDate: Date | undefined) => void;
  
  addAttachment: (listId: string, cardId: string, name: string, url: string, type: 'file' | 'link') => void;
  deleteAttachment: (listId: string, cardId: string, attachmentId: string) => void;
  
  // New methods for covers
  updateCardCover: (listId: string, cardId: string, cover: Cover | undefined) => void;
  updateListCover: (listId: string, cover: Cover | undefined) => void;
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
          created: new Date(),
          comments: [],
          checklists: [],
          labels: [{ id: 'label-1', name: 'Research', color: 'blue' }],
          assignedUsers: [],
          attachments: []
        },
        {
          id: 'card-2',
          title: 'Sketch wireframes',
          description: 'Create rough layouts for key screens',
          created: new Date(),
          comments: [],
          checklists: [],
          labels: [{ id: 'label-2', name: 'Design', color: 'green' }],
          assignedUsers: []
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
          created: new Date(),
          comments: [],
          checklists: [],
          labels: [{ id: 'label-3', name: 'Design', color: 'green' }],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          assignedUsers: []
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
          created: new Date(),
          comments: [],
          checklists: [
            {
              id: 'checklist-1',
              title: 'Setup tasks',
              items: [
                { id: 'item-1', text: 'Initialize repo', checked: true },
                { id: 'item-2', text: 'Configure CI/CD', checked: true }
              ]
            }
          ],
          labels: [{ id: 'label-4', name: 'Setup', color: 'purple' }],
          assignedUsers: []
        }
      ]
    }
  ]
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<BoardData>(initialBoardData);

  // Existing methods
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
      comments: [],
      checklists: [],
      labels: [],
      assignedUsers: [],
      attachments: []
    };
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
    }));
    toast.success("Card added");
  };

  const updateCard = (listId: string, updatedCard: Card) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list =>
        list.id === listId ? {
          ...list,
          cards: list.cards.map(card =>
            card.id === updatedCard.id ? updatedCard : card
          )
        } : list
      ),
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

  const moveCard = (cardId: string, fromListId: string, toListId: string, newIndex?: number) => {
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
            const newCards = [...list.cards];
            if (typeof newIndex === 'number') {
              newCards.splice(newIndex, 0, cardToMove!);
            } else {
              newCards.push(cardToMove!);
            }
            return { ...list, cards: newCards };
          }
          return list;
        });
        return { ...prevBoard, lists: finalLists };
      }

      return prevBoard;
    });
    toast.success("Card moved");
  };

  // New methods for card details
  const addComment = (listId: string, cardId: string, text: string, author: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      author,
      createdAt: new Date(),
    };
    
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  comments: [...(card.comments || []), newComment],
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Comment added");
  };

  const deleteComment = (listId: string, cardId: string, commentId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.comments) {
                return {
                  ...card,
                  comments: card.comments.filter(comment => comment.id !== commentId),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Comment deleted");
  };

  const addChecklist = (listId: string, cardId: string, title: string) => {
    const newChecklist: Checklist = {
      id: `checklist-${Date.now()}`,
      title,
      items: [],
    };
    
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  checklists: [...(card.checklists || []), newChecklist],
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Checklist added");
  };

  const deleteChecklist = (listId: string, cardId: string, checklistId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.checklists) {
                return {
                  ...card,
                  checklists: card.checklists.filter(checklist => checklist.id !== checklistId),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Checklist deleted");
  };

  const addChecklistItem = (listId: string, cardId: string, checklistId: string, text: string) => {
    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      text,
      checked: false,
    };
    
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.checklists) {
                return {
                  ...card,
                  checklists: card.checklists.map(checklist => {
                    if (checklist.id === checklistId) {
                      return {
                        ...checklist,
                        items: [...checklist.items, newItem],
                      };
                    }
                    return checklist;
                  }),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Item added");
  };

  const updateChecklistItem = (listId: string, cardId: string, checklistId: string, itemId: string, checked: boolean) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.checklists) {
                return {
                  ...card,
                  checklists: card.checklists.map(checklist => {
                    if (checklist.id === checklistId) {
                      return {
                        ...checklist,
                        items: checklist.items.map(item => {
                          if (item.id === itemId) {
                            return { ...item, checked };
                          }
                          return item;
                        }),
                      };
                    }
                    return checklist;
                  }),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Item updated");
  };

  const deleteChecklistItem = (listId: string, cardId: string, checklistId: string, itemId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.checklists) {
                return {
                  ...card,
                  checklists: card.checklists.map(checklist => {
                    if (checklist.id === checklistId) {
                      return {
                        ...checklist,
                        items: checklist.items.filter(item => item.id !== itemId),
                      };
                    }
                    return checklist;
                  }),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Item deleted");
  };

  const addLabel = (listId: string, cardId: string, name: string, color: string) => {
    const newLabel: Label = {
      id: `label-${Date.now()}`,
      name,
      color,
    };
    
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  labels: [...(card.labels || []), newLabel],
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Label added");
  };

  const deleteLabel = (listId: string, cardId: string, labelId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.labels) {
                return {
                  ...card,
                  labels: card.labels.filter(label => label.id !== labelId),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Label deleted");
  };

  const assignUser = (listId: string, cardId: string, userId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                const assignedUsers = card.assignedUsers || [];
                if (!assignedUsers.includes(userId)) {
                  return {
                    ...card,
                    assignedUsers: [...assignedUsers, userId],
                  };
                }
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("User assigned");
  };

  const unassignUser = (listId: string, cardId: string, userId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.assignedUsers) {
                return {
                  ...card,
                  assignedUsers: card.assignedUsers.filter(id => id !== userId),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("User unassigned");
  };

  const updateDueDate = (listId: string, cardId: string, dueDate: Date | undefined) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  dueDate,
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Due date updated");
  };

  const addAttachment = (listId: string, cardId: string, name: string, url: string, type: 'file' | 'link') => {
    const newAttachment: Attachment = {
      id: `attachment-${Date.now()}`,
      name,
      url,
      type,
      createdAt: new Date(),
    };
    
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  attachments: [...(card.attachments || []), newAttachment],
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Attachment added");
  };

  const deleteAttachment = (listId: string, cardId: string, attachmentId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId && card.attachments) {
                return {
                  ...card,
                  attachments: card.attachments.filter(attachment => attachment.id !== attachmentId),
                };
              }
              return card;
            }),
          };
        }
        return list;
      }),
    }));
    toast.success("Attachment deleted");
  };

  // New methods for covers
  const updateCardCover = (listId: string, cardId: string, cover: Cover | undefined) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => {
              if (card.id === cardId) {
                return {
                  ...card,
                  cover
                };
              }
              return card;
            })
          };
        }
        return list;
      })
    }));
    toast.success(cover ? "Card cover updated" : "Card cover removed");
  };

  const updateListCover = (listId: string, cover: Cover | undefined) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      lists: prevBoard.lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cover
          };
        }
        return list;
      })
    }));
    toast.success(cover ? "List cover updated" : "List cover removed");
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
        deleteAttachment,
        updateCardCover,
        updateListCover,
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
