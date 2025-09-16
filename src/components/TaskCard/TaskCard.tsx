import React from 'react';
import { Task } from '../../types';
import { useKanban } from '../../context/KanbanContext';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask } = useKanban();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData('taskId', task.id);
    // Add a class to the dragged element
    e.currentTarget.classList.add('task-card--dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Remove the dragging class
    e.currentTarget.classList.remove('task-card--dragging');
    // Remove any remaining drop target indicators
    const taskCards = document.querySelectorAll('.task-card--drop-target');
    taskCards.forEach(card => card.classList.remove('task-card--drop-target'));
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-task-id={task.id}
    >
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <button
          className="task-card__delete"
          onClick={() => deleteTask(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      <div className="task-card__footer">
        <span className="task-card__date">
          {new Date(task.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;