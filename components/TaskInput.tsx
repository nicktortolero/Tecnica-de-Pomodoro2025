import React, { useState } from 'react';

interface TaskInputProps {
  onAddTask: (taskName: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask(taskName.trim());
      setTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="flex-1 bg-gray-700 text-white rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Añadir tarea..."
      />
      <button
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-r-lg transition-colors"
      >
        <i className="fas fa-plus"></i>
      </button>
    </form>
  );
};

export default TaskInput;