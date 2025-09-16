export const STORAGE_KEYS = {
  KANBAN_STATE: 'kanban-state',
  THEME: 'theme'
} as const;

export const COLUMN_TYPES = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  DONE: 'done'
} as const;

export const COLUMN_TITLES = {
  [COLUMN_TYPES.TODO]: 'To Do',
  [COLUMN_TYPES.IN_PROGRESS]: 'In Progress',
  [COLUMN_TYPES.DONE]: 'Done'
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;

export const ERRORS = {
  TITLE_REQUIRED: 'Title is required',
  DESCRIPTION_TOO_LONG: 'Description must be less than 500 characters',
  INVALID_COLUMN: 'Invalid column type',
  STORAGE_ERROR: 'Error accessing local storage'
} as const;

export const DRAG_DROP = {
  EFFECT_ALLOWED: 'move',
  DROP_EFFECT: 'move',
  DATA_TYPE: 'text/plain'
} as const;

export const BREAKPOINTS = {
  MOBILE: 576,
  TABLET: 768,
  DESKTOP: 992,
  LARGE: 1200
} as const;