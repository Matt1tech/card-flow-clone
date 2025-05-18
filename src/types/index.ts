
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

export interface BoardData {
  lists: List[];
}
