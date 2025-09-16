import React from 'react';
import { Column as ColumnInterface } from '../../interfaces/kanban';
import { useKanban } from '../../context/KanbanContext';
import { useKanbanDrag } from '../../hooks/useKanbanDrag';
import TaskCard from '../TaskCard/TaskCard';
import './Column.scss';

interface ColumnProps {
  column: ColumnInterface;
}

const Column: React.FC<ColumnProps> = ({ column }) => {
  const { moveTask } = useKanban();
  const { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useKanbanDrag(
    column.id,
    (taskId: string) => moveTask(taskId, column.id)
  );

  return (
    <div
      className={`column column--${column.id}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="column__title">{column.title}</h2>
      <div 
        className={`column__content ${dragState.sourceColumn && dragState.sourceColumn !== column.id ? 'can-drop' : ''}`}
      >
        {column.tasks.map(task => (
          <div key={task.id} className="task-card-wrapper">
            <TaskCard 
              task={task}
              isDragging={dragState.draggedTaskId === task.id}
              onDragStart={() => handleDragStart(task.id)}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;