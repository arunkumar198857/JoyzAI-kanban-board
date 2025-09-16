import React from 'react';
import { Column as ColumnType, ColumnType as ColumnId } from '../../types';
import { useKanban } from '../../context/KanbanContext';
import TaskCard from '../TaskCard/TaskCard';
import './Column.scss';

interface ColumnProps {
  column: ColumnType;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const { moveTask } = useKanban();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add visual indicator for drop target
    const taskCard = (e.target as HTMLElement).closest('.task-card');
    if (taskCard) {
      taskCard.classList.add('task-card--drop-target');
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual indicator
    const taskCards = document.querySelectorAll('.task-card--drop-target');
    taskCards.forEach(card => card.classList.remove('task-card--drop-target'));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove visual indicators
    const taskCards = document.querySelectorAll('.task-card--drop-target');
    taskCards.forEach(card => card.classList.remove('task-card--drop-target'));

    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return; // Don't proceed if no task ID

    // Get the closest TaskCard element from the actual drop target
    const targetCard = (e.target as HTMLElement).closest('.task-card');
    const targetTaskId = targetCard?.getAttribute('data-task-id');
    
    // Don't move if dropping on the same task
    if (taskId === targetTaskId) return;
    
    moveTask(taskId, column.id as ColumnId, targetTaskId || undefined);
  };

  return (
    <div
      className={`column column--${column.id}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="column__title">{column.title}</h2>
      <div className="column__content">
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;