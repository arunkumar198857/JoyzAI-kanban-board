# JoyzAI Kanban Board

A modern, responsive Kanban board application built with React and TypeScript. Features drag-and-drop task management, dark/light theme support, and local storage persistence.

## Features

- 📋 Drag and drop task management
- 🎨 Dark/Light theme toggle
- 💾 Local storage persistence
- 📱 Responsive design
- 🎯 TypeScript support
- 🎭 SCSS styling with CSS variables

## Tech Stack

- React
- TypeScript
- SCSS
- HTML5 Drag and Drop API
- LocalStorage for data persistence

## Project Structure

```
src/
├── components/
│   ├── Column/         # Kanban column component
│   ├── TaskCard/       # Individual task component
│   ├── TaskForm/       # New task creation form
│   └── ThemeToggle/    # Theme switcher component
├── context/
│   ├── KanbanContext.tsx  # Kanban state management
│   └── ThemeContext.tsx   # Theme state management
├── styles/
│   ├── _variables.scss    # Global SCSS variables
│   └── App.scss          # Main application styles
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/
    └── storage.ts        # LocalStorage utilities
```

## Features in Detail

### Kanban Board
- Three columns: To Do, In Progress, and Done
- Drag and drop interface for task management
- Visual feedback during drag operations
- Smooth animations for better UX

### Task Management
- Create new tasks with title and description
- Form validation for required fields
- Error feedback for invalid inputs
- Drag and drop between columns

### Theme Support
- Light and dark theme support
- System-based theme detection
- Theme persistence across sessions
- Smooth theme transitions

### Responsive Design
- Mobile-friendly layout
- Flexible column arrangement
- Adaptive spacing and typography
- Touch-friendly interactions
