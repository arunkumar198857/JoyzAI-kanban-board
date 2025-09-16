import React from 'react';
import { Task } from '../../interfaces/kanban';
import { useKanban } from '../../context/KanbanContext';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  isDragging = false,
  onDragStart,
  onDragEnd 
}) => {
  const { deleteTask } = useKanban();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart();
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    onDragEnd();
  };

  return (
    <div
      className={`task-card ${isDragging ? 'task-card--dragging' : ''}`}
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