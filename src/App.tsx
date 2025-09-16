import React from 'react';
import { KanbanProvider } from './context/KanbanContext';
import { useKanban } from './context/KanbanContext';
import TaskForm from './components/TaskForm/TaskForm';
import Column from './components/Column/Column';
import './styles/App.scss';

const KanbanBoard: React.FC = () => {
  const { state } = useKanban();

  return (
    <div className="kanban">
      <TaskForm />
      <div className="kanban__board">
        {state.columns.map(column => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <KanbanProvider>
      <div className="app">
        <header className="app__header">
          <h1>JoyzAI - Kanban Board</h1>
        </header>
        <main className="app__main">
          <KanbanBoard />
        </main>
      </div>
    </KanbanProvider>
  );
}

export default App;
