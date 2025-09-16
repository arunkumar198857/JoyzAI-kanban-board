export type ColumnType = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
  createdAt: Date;
  index: number;
}

export interface Column {
  id: ColumnType;
  title: string;
  tasks: Task[];
}

export interface KanbanState {
  tasks: Task[];
  columns: Column[];
}

export interface KanbanContextType {
  state: KanbanState;
  addTask: (title: string, description: string) => void;
  moveTask: (taskId: string, targetColumn: ColumnType) => void;
  deleteTask: (taskId: string) => void;
}

export interface FormData {
  title: string;
  description: string;
}