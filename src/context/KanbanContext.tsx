import React, { createContext, useContext, useState, useEffect } from 'react';
import { KanbanState, KanbanContextType, Task, ColumnType, Column } from '../types';
import { loadState, saveState, generateId } from '../utils/storage';

const initialState: KanbanState = {
  tasks: [],
  columns: [
    { id: 'todo', title: 'To Do', tasks: [] },
    { id: 'inProgress', title: 'In Progress', tasks: [] },
    { id: 'done', title: 'Done', tasks: [] }
  ]
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<KanbanState>(initialState);

  // Load saved state on mount
  useEffect(() => {
    const savedState = loadState();
    if (savedState) {
      setState(savedState);
    }
  }, []);

  // Add a new task
  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      column: 'todo',
      createdAt: new Date()
    };

    const newState = {
      ...state,
      tasks: [newTask, ...state.tasks],
      columns: state.columns.map(column =>
        column.id === 'todo'
          ? { ...column, tasks: [newTask, ...column.tasks] }
          : column
      )
    };

    setState(newState);
    saveState(newState);
  };

  // Helper function to reorder tasks within the same column
  const reorderTasks = (
    tasks: Task[],
    taskId: string,
    targetTaskId: string | undefined,
    updatedTask: Task
  ): Task[] => {
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
  };

  // Helper function to update column tasks
  const updateColumnTasks = (
    column: Column,
    taskId: string,
    sourceColumn: ColumnType,
    targetColumn: ColumnType,
    targetTaskId: string | undefined,
    updatedTask: Task
  ): Column => {
    // Same column reordering
    if (column.id === sourceColumn && column.id === targetColumn) {
      return {
        ...column,
        tasks: reorderTasks(column.tasks, taskId, targetTaskId, updatedTask)
      };
    }

    // Remove from source column
    if (column.id === sourceColumn) {
      return {
        ...column,
        tasks: column.tasks.filter((t: Task) => t.id !== taskId)
      };
    }

    // Add to target column
    if (column.id === targetColumn) {
      return {
        ...column,
        tasks: reorderTasks(column.tasks, taskId, targetTaskId, updatedTask)
      };
    }

    return column;
  };

  // Move task between columns or reorder within column
  const moveTask = (taskId: string, targetColumn: ColumnType, targetTaskId?: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, column: targetColumn };
    const newState = {
      ...state,
      tasks: state.tasks.map(t => t.id === taskId ? updatedTask : t),
      columns: state.columns.map(column =>
        updateColumnTasks(column, taskId, task.column, targetColumn, targetTaskId, updatedTask)
      )
    };

    setState(newState);
    saveState(newState);
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const newState = {
      ...state,
      tasks: state.tasks.filter(t => t.id !== taskId),
      columns: state.columns.map(column => ({
        ...column,
        tasks: column.tasks.filter(t => t.id !== taskId)
      }))
    };

    setState(newState);
    saveState(newState);
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