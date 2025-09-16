import React, { createContext, useContext, useState, useEffect } from 'react';
import { KanbanState, KanbanContextType, Task, ColumnType } from '../interfaces/kanban';
import { kanbanService } from '../services/kanban.service';
import { COLUMN_TYPES } from '../constants';

const initialState = kanbanService.getInitialState();

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<KanbanState>(initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = kanbanService.loadState();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  // Add a new task
  const addTask = (title: string, description: string) => {
    const newTask = kanbanService.createTask(title, description);
    const newState: KanbanState = {
      ...state,
      tasks: [newTask, ...state.tasks],
      columns: state.columns.map(column =>
        column.id === COLUMN_TYPES.TODO
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    };

    setState(newState);
    kanbanService.saveState(newState);
  };

  // Move task between columns or reorder within column
  const moveTask = (taskId: string, targetColumn: ColumnType, targetTaskId?: string) => {
    const newState = kanbanService.moveTask(state, taskId, targetColumn, targetTaskId);
    setState(newState);
    kanbanService.saveState(newState);
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const newState = kanbanService.deleteTask(state, taskId);
    setState(newState);
    kanbanService.saveState(newState);
  };

  return (
    <KanbanContext.Provider value={{ state, addTask, moveTask, deleteTask }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};