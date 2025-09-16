import React, { useState, useCallback } from 'react';
import { useKanban } from '../../context/KanbanContext';
import './TaskForm.scss';

interface TaskFormData {
  title: string;
  description: string;
}

const INITIAL_FORM_STATE: TaskFormData = {
  title: '',
  description: ''
};

const TaskForm: React.FC = () => {
  const [formData, setFormData] = useState<TaskFormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const { addTask } = useKanban();

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof TaskFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    addTask(formData.title.trim(), formData.description.trim());
    setFormData(INITIAL_FORM_STATE);
  }, [formData, validateForm, addTask]);

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__field">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
        />
        {errors.title && (
          <span className="task-form__error">{errors.title}</span>
        )}
      </div>
      <div className="task-form__field">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description (optional)"
          className="task-form__textarea"
        />
      </div>
      <button type="submit" className="task-form__button">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;