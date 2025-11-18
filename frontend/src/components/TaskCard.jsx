import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { fa } from 'date-fns/locale';

const priorityConfig = {
  1: { label: 'کم', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  2: { label: 'متوسط', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  3: { label: 'زیاد', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  4: { label: 'فوری', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
};

const TaskCard = ({ task, onClick, onToggle, labels = [] }) => {
  const priority = priorityConfig[task.priority] || priorityConfig[2];
  const taskLabels = labels.filter((l) => task.labelIds?.includes(l.id));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div
        onClick={onClick}
        className={`
          relative p-4 rounded-2xl cursor-pointer
          bg-white dark:bg-gray-800
          shadow-sm hover:shadow-md active:shadow-sm
          transition-all duration-200
          ${task.isCompleted ? 'opacity-60' : ''}
        `}
      >
        {/* Priority indicator */}
        <div className={`absolute top-0 right-0 w-1 h-full rounded-r-2xl ${priority.bg}`} />

        <div className="flex items-start gap-3 pr-2">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="flex-shrink-0 mt-0.5"
          >
            {task.isCompleted ? (
              <CheckCircleIconSolid className="w-6 h-6 text-primary-500" />
            ) : (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircleIcon className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-primary-400 transition-colors" />
              </motion.div>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title */}
            <h3
              className={`
                font-semibold text-gray-900 dark:text-white
                ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}
              `}
            >
              {task.title}
            </h3>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Priority */}
              <div className={`flex items-center gap-1 ${priority.color}`}>
                <FlagIcon className="w-4 h-4" />
                <span className="font-medium">{priority.label}</span>
              </div>

              {/* Deadline */}
              {task.deadline && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {format(new Date(task.deadline), 'd MMM', { locale: fa })}
                  </span>
                </div>
              )}

              {/* Labels */}
              {taskLabels.length > 0 && (
                <div className="flex items-center gap-1">
                  {taskLabels.slice(0, 2).map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                      }}
                    >
                      <TagIcon className="w-3 h-3" />
                      {label.name}
                    </span>
                  ))}
                  {taskLabels.length > 2 && (
                    <span className="text-gray-400 text-xs">
                      +{taskLabels.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
