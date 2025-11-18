import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="group"
    >
      <div
        onClick={onClick}
        className={`
          relative p-3 sm:p-3.5 rounded-xl cursor-pointer
          bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
          hover:border-gray-200 dark:hover:border-gray-600
          active:border-gray-300 dark:active:border-gray-500
          transition-all duration-150
          ${task.isCompleted ? 'opacity-50' : ''}
        `}
      >
        {/* Priority indicator */}
        <div className={`absolute top-0 right-0 w-1 h-full rounded-r-xl ${priority.bg}`} />

        <div className="flex items-center gap-2.5 pr-2">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
            className="flex-shrink-0"
          >
            {task.isCompleted ? (
              <CheckCircleIconSolid className="w-5 h-5 text-primary-500" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-primary-400 transition-colors" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Meta in one line */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3
                className={`
                  text-sm font-medium text-gray-900 dark:text-white truncate
                  ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}
                `}
              >
                {task.title}
              </h3>

              {/* Priority badge - compact */}
              <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded ${priority.bg} ${priority.color} font-medium`}>
                {priority.label}
              </span>
            </div>

            {/* Meta info - compact */}
            <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              {/* Deadline */}
              {task.deadline && (
                <div className="flex items-center gap-0.5">
                  <ClockIcon className="w-3 h-3" />
                  <span>{format(new Date(task.deadline), 'd MMM', { locale: faIR })}</span>
                </div>
              )}

              {/* Labels - very compact */}
              {taskLabels.length > 0 && (
                <>
                  {taskLabels.length <= 2 ? (
                    taskLabels.map((label) => (
                      <span
                        key={label.id}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          backgroundColor: `${label.color}15`,
                          color: label.color,
                        }}
                      >
                        {label.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px]">
                      <TagIcon className="w-3 h-3 inline" /> {taskLabels.length}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
