import { Task, KanbanState } from '../interfaces/kanban';

const STORAGE_KEY = 'kanban_state';

export const loadState = (): KanbanState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    
    const state = JSON.parse(serializedState);
    // Convert string dates back to Date objects
    state.tasks = state.tasks.map((task: Task) => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
    
    return state;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export const saveState = (state: KanbanState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};