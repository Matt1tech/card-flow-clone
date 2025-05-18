
export interface Card {
  id: string;
  title: string;
  description: string;
  created: Date;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

export interface Workspace {
  id: string;
  title: string;
  description: string;
  boards: Board[];
}
