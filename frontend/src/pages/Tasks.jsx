import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import useTaskStore from '../stores/taskStore';

const Tasks = () => {
  const { getTasks, toggleTaskComplete, addTask } = useTaskStore();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasks = getTasks();

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      sectionId: 'default',
      priority: 1,
      labelIds: [],
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
          وظایف من
        </h1>
        <button
          onClick={() => setIsAddingTask(true)}
          className="flex items-center space-x-2 space-x-reverse bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>افزودن وظیفه</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <div className="bg-white dark:bg-dark-bg-secondary rounded-xl p-4 mb-6 border border-light-border dark:border-dark-border">
          <form onSubmit={handleAddTask} className="flex space-x-3 space-x-reverse">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="عنوان وظیفه..."
              className="flex-1 px-4 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              اضافه
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskTitle('');
              }}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-light-text dark:text-dark-text font-medium py-2 px-6 rounded-lg transition-colors"
            >
              لغو
            </button>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg">
              هنوز وظیفه‌ای اضافه نکرده‌اید
            </p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="mt-4 text-primary-600 dark:text-primary-500 hover:underline"
            >
              اولین وظیفه خود را اضافه کنید
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center space-x-4 space-x-reverse p-4 rounded-xl border transition-all ${
                task.completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-dark-bg-secondary border-light-border dark:border-dark-border hover:shadow-md'
              }`}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskComplete(task.id)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
              />

              {/* Task Title */}
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    task.completed
                      ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
                      : 'text-light-text dark:text-dark-text'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mt-1">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Priority Badge */}
              {task.priority > 1 && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    task.priority === 4
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      : task.priority === 3
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}
                >
                  {task.priority === 4 ? 'فوری' : task.priority === 3 ? 'زیاد' : 'متوسط'}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
