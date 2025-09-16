import { useState, useCallback } from 'react';
import { ColumnType } from '../interfaces/kanban';

interface DragState {
  isDragging: boolean;
  sourceColumn: ColumnType | null;
  draggedTaskId: string | null;
}

export function useKanbanDrag(
  columnId: ColumnType,
  onTaskMove: (taskId: string) => void
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    sourceColumn: null,
    draggedTaskId: null
  });

  const handleDragStart = useCallback((taskId: string) => {
    setDragState({
      isDragging: true,
      sourceColumn: columnId,
      draggedTaskId: taskId
    });
  }, [columnId]);

  const handleDragEnd = useCallback(() => {
    setDragState({
      isDragging: false,
      sourceColumn: null,
      draggedTaskId: null
    });
    document.body.classList.remove('dragging');
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't allow dropping in the same column
    if (dragState.sourceColumn === columnId) {
      return;
    }

    document.body.classList.add('dragging');
  }, [dragState.sourceColumn, columnId]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) {
      handleDragEnd();
      return;
    }

    // Don't allow dropping in the same column
    if (dragState.sourceColumn === columnId) {
      handleDragEnd();
      return;
    }

    // Move the task to the new column
    onTaskMove(taskId);

    handleDragEnd();
  }, [handleDragEnd, onTaskMove, dragState.sourceColumn, columnId]);

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };
}