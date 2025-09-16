import React from 'react';
import { KanbanProvider, useKanban } from './context/KanbanContext';
import { Column as IColumn } from './interfaces/kanban';
import { ThemeProvider } from './context/ThemeContext';
import TaskForm from './components/TaskForm/TaskForm';
import Column from './components/Column/Column';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import './styles/App.scss';

const KanbanBoard: React.FC = () => {
  const { state } = useKanban();

  return (
    <div className="kanban">
      <TaskForm />
      <div className="kanban__board">
        {state.columns.map((column: IColumn) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <KanbanProvider>
        <div className="app">
          <header className="app__header">
            <h1>JoyzAI - Kanban Board</h1>
            <ThemeToggle />
          </header>
          <main className="app__main">
            <KanbanBoard />
          </main>
        </div>
      </KanbanProvider>
    </ThemeProvider>
  );
}

export default App;
