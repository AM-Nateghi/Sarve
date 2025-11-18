import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const SortableTaskItem = ({
  task,
  priority,
  isOverdue,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`group relative bg-white dark:bg-dark-bg-secondary rounded-xl p-5 border transition-all hover:shadow-lg ${
        task.completed
          ? 'border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10'
          : isOverdue
          ? 'border-red-300 dark:border-red-700'
          : 'border-light-border dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700'
      } ${isDragging ? 'shadow-2xl ring-2 ring-primary-500' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 flex-shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity touch-none"
          title="جابجایی"
        >
          <Bars3Icon className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary hover:text-primary-500 dark:hover:text-primary-400" />
        </button>

        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0"
        >
          {task.completed ? (
            <CheckCircleSolid className="w-6 h-6 text-green-500" />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-light-border dark:border-dark-border hover:border-primary-500 dark:hover:border-primary-500 transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              task.completed
                ? 'line-through text-light-text-secondary dark:text-dark-text-secondary'
                : 'text-light-text dark:text-dark-text'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary mb-3">
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priority.color}`}>
              {priority.label}
            </span>

            {/* Due Date */}
            {task.dueDate && (
              <span className={`flex items-center space-x-1 space-x-reverse px-3 py-1 rounded-full text-xs font-medium ${
                isOverdue
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              }`}>
                <CalendarIcon className="w-3 h-3" />
                <span>{new Date(task.dueDate).toLocaleDateString('fa-IR')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
            title="ویرایش"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id, task.title)}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
            title="حذف"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SortableTaskItem;
