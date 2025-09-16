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

  createTask(title: string, description: string, state?: KanbanState): Task {
    // Get the highest index in the TODO column
    const highestIndex = state 
      ? Math.max(-1, ...state.columns
          .find(col => col.id === COLUMN_TYPES.TODO)?.tasks
          .map(t => t.index) || [-1])
      : -1;

    return {
      id: generateId(),
      title,
      description,
      column: COLUMN_TYPES.TODO as ColumnType,
      createdAt: new Date(),
      index: highestIndex + 1
    };
  }

  reorderTasks(
    tasks: Task[],
    taskId: string,
    targetTaskId: string | undefined,
    updatedTask: Task
  ): Task[] {
    // If no target specified, add to the end
    if (!targetTaskId) {
      return [...tasks.filter(t => t.id !== taskId), updatedTask];
    }

    const result = [...tasks];
    const movedTaskIndex = result.findIndex(t => t.id === taskId);
    const targetTaskIndex = result.findIndex(t => t.id === targetTaskId);

    // If either task is not found, return original array
    if (movedTaskIndex === -1 || targetTaskIndex === -1) {
      return tasks;
    }

    // Remove the task from its current position
    result.splice(movedTaskIndex, 1);

    // Find the new position of the target (it might have shifted if target was after the moved task)
    const newTargetIndex = result.findIndex(t => t.id === targetTaskId);

    // Insert the moved task at the target position
    result.splice(newTargetIndex, 0, updatedTask);

    return result;
  }

  updateColumnTasks(
    column: Column,
    taskId: string,
    sourceColumn: ColumnType,
    targetColumn: ColumnType,
    updatedTask: Task
  ): Column {
    // Remove from source column
    if (column.id === sourceColumn) {
      return {
        ...column,
        tasks: column.tasks.filter(t => t.id !== taskId)
      };
    }

    // Add to target column at the top
    if (column.id === targetColumn) {
      return {
        ...column,
        tasks: [updatedTask, ...column.tasks]
      };
    }

    return column;
  }

  moveTask(
    state: KanbanState,
    taskId: string,
    targetColumn: ColumnType
  ): KanbanState {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task || task.column === targetColumn) return state;

    const updatedTask: Task = { ...task, column: targetColumn };
    return {
      ...state,
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      columns: state.columns.map(column =>
        this.updateColumnTasks(column, taskId, task.column, targetColumn, updatedTask)
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