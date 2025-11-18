import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useUpdateSection, useDeleteSection } from '../hooks/useSections';

const SectionHeader = ({ section, taskCount, isCollapsed, onToggleCollapse, onAddTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(section.name);

  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  const handleSave = async () => {
    if (editName.trim() && editName !== section.name) {
      await updateSectionMutation.mutateAsync({
        id: section.id,
        data: { name: editName.trim(), order: section.order },
      });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditName(section.name);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`آیا از حذف بخش "${section.name}" اطمینان دارید؟`)) {
      await deleteSectionMutation.mutateAsync(section.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Right side - Name & Count */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Collapse button */}
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronUpIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Section name */}
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyPress}
              className="flex-1 px-2 py-1 text-sm font-semibold bg-gray-50 dark:bg-gray-700 rounded border border-primary-400 dark:border-primary-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {section.name}
              </h3>
              <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {taskCount}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Add task button */}
          <button
            onClick={onAddTask}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            title="افزودن وظیفه"
          >
            <PlusIcon className="w-4 h-4 text-gray-500 group-hover:text-primary-500" />
          </button>

          {/* Edit button */}
          {section.isDeletable && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                title="ویرایش بخش"
              >
                <PencilIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
              </button>

              {/* Delete button */}
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                title="حذف بخش"
              >
                <TrashIcon className="w-4 h-4 text-gray-500 group-hover:text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
