import { Task, Column, KanbanState, ColumnType } from '../interfaces/kanban';
import { STORAGE_KEYS, COLUMN_TYPES } from '../constants';

const STORAGE_KEY = STORAGE_KEYS.KANBAN_STATE;

// Utility function to generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

class KanbanService {
  getInitialState(): KanbanState {
    return {
      tasks: [],
      columns: [
        { id: COLUMN_TYPES.TODO as ColumnType, title: 'To Do', tasks: [] },
        { id: COLUMN_TYPES.IN_PROGRESS as ColumnType, title: 'In Progress', tasks: [] },
        { id: COLUMN_TYPES.DONE as ColumnType, title: 'Done', tasks: [] }
      ]
    };
  }

  loadState(): KanbanState | null {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (!savedState) return null;

      const parsedState = JSON.parse(savedState);
      // Convert stored date strings back to Date objects
      return {
        ...parsedState,
        tasks: parsedState.tasks.map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }))
      };
    } catch (error) {
      console.error('Error loading state:', error);
      return null;
    }
  }

  saveState(state: KanbanState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }

  createTask(title: string, description: string): Task {
    return {
      id: generateId(),
      title,
      description,
      column: COLUMN_TYPES.TODO as ColumnType,
      createdAt: new Date()
    };
  }

  reorderTasks(
    tasks: Task[],
    taskId: string,
    targetTaskId: string | undefined,
    updatedTask: Task
  ): Task[] {
    const currentTasks = [...tasks];
    const taskIndex = currentTasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      currentTasks.splice(taskIndex, 1);
    }

    if (!targetTaskId) {
      return [updatedTask, ...currentTasks];
    }

    const targetIndex = currentTasks.findIndex(t => t.id === targetTaskId);
    if (targetIndex === -1) {
      return [updatedTask, ...currentTasks];
    }

    currentTasks.splice(targetIndex, 0, updatedTask);
    return currentTasks;
  }

  updateColumnTasks(
    column: Column,
    taskId: string,
    sourceColumn: ColumnType,
    targetColumn: ColumnType,
    targetTaskId: string | undefined,
    updatedTask: Task
  ): Column {
    // Same column reordering
    if (column.id === sourceColumn && column.id === targetColumn) {
      return {
        ...column,
        tasks: this.reorderTasks(column.tasks, taskId, targetTaskId, updatedTask)
      };
    }

    // Remove from source column
    if (column.id === sourceColumn) {
      return {
        ...column,
        tasks: column.tasks.filter(t => t.id !== taskId)
      };
    }

    // Add to target column
    if (column.id === targetColumn) {
      return {
        ...column,
        tasks: this.reorderTasks(column.tasks, taskId, targetTaskId, updatedTask)
      };
    }

    return column;
  }

  moveTask(
    state: KanbanState,
    taskId: string,
    targetColumn: ColumnType,
    targetTaskId?: string
  ): KanbanState {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return state;

    const updatedTask: Task = { ...task, column: targetColumn };
    return {
      ...state,
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      columns: state.columns.map(column =>
        this.updateColumnTasks(column, taskId, task.column, targetColumn, targetTaskId, updatedTask)
      )
    };
  }

  deleteTask(state: KanbanState, taskId: string): KanbanState {
    return {
      ...state,
      tasks: state.tasks.filter(t => t.id !== taskId),
      columns: state.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(t => t.id !== taskId)
      }))
    };
  }
}

export const kanbanService = new KanbanService();