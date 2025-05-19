export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "file" | "link" | "folder";
  createdAt: Date;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  created: Date;
  comments?: Comment[];
  checklists?: Checklist[];
  labels?: Label[];
  assignedUsers?: string[];
  dueDate?: Date;
  attachments?: Attachment[];
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
