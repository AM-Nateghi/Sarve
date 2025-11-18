import { useState } from 'react';
import { PlusIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabels, useCreateLabel } from '../hooks/useLabels';

// رنگ‌های پیش‌فرض برای لیبل‌ها
export const LABEL_COLORS = [
  { value: 'red', label: 'قرمز', hex: '#EF4444' },
  { value: 'orange', label: 'نارنجی', hex: '#F97316' },
  { value: 'yellow', label: 'زرد', hex: '#EAB308' },
  { value: 'green', label: 'سبز', hex: '#22C55E' },
  { value: 'blue', label: 'آبی', hex: '#3B82F6' },
  { value: 'purple', label: 'بنفش', hex: '#A855F7' },
  { value: 'pink', label: 'صورتی', hex: '#EC4899' },
  { value: 'gray', label: 'خاکستری', hex: '#6B7280' },
];

const LabelPicker = ({ selectedLabels = [], onChange }) => {
  const { data: labels = [] } = useLabels();
  const createLabelMutation = useCreateLabel();
  const [isCreating, setIsCreating] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: '', color: 'blue' });

  const toggleLabel = (labelId) => {
    if (selectedLabels.includes(labelId)) {
      onChange(selectedLabels.filter(id => id !== labelId));
    } else {
      onChange([...selectedLabels, labelId]);
    }
  };

  const handleCreateLabel = async (e) => {
    e.preventDefault();
    if (newLabel.name.trim()) {
      const label = {
        name: newLabel.name.trim(),
        color: newLabel.color,
      };
      await createLabelMutation.mutateAsync(label);
      setNewLabel({ name: '', color: 'blue' });
      setIsCreating(false);
    }
  };

  const getColorConfig = (colorValue) => {
    return LABEL_COLORS.find(c => c.value === colorValue) || LABEL_COLORS[0];
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-light-text dark:text-dark-text">
        برچسب‌ها
      </label>

      {/* لیست لیبل‌های موجود */}
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => {
          const colorConfig = getColorConfig(label.color);
          const isSelected = selectedLabels.includes(label.id);

          return (
            <button
              key={label.id}
              type="button"
              onClick={() => toggleLabel(label.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? 'text-white ring-2 ring-offset-2 ring-primary-500'
                  : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text dark:text-dark-text hover:bg-light-border dark:hover:bg-dark-border'
              }`}
              style={isSelected ? { backgroundColor: colorConfig.hex } : {}}
            >
              <TagIcon className="w-3 h-3" />
              <span>{label.name}</span>
            </button>
          );
        })}

        {/* دکمه اضافه کردن لیبل جدید */}
        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors"
          >
            <PlusIcon className="w-3 h-3" />
            <span>برچسب جدید</span>
          </button>
        )}
      </div>

      {/* فرم ساخت لیبل جدید */}
      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateLabel}
            className="p-4 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg border border-light-border dark:border-dark-border"
          >
            <div className="space-y-3">
              {/* نام لیبل */}
              <div>
                <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-1">
                  نام برچسب
                </label>
                <input
                  type="text"
                  value={newLabel.name}
                  onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                  placeholder="مثلاً: فوری، مهم، کار شخصی"
                  className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              </div>

              {/* انتخاب رنگ */}
              <div>
                <label className="block text-xs font-medium text-light-text dark:text-dark-text mb-2">
                  رنگ
                </label>
                <div className="flex flex-wrap gap-2">
                  {LABEL_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewLabel({ ...newLabel, color: color.value })}
                      className={`w-8 h-8 rounded-full transition-all ${
                        newLabel.color === color.value
                          ? 'ring-2 ring-offset-2 ring-primary-500 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* دکمه‌ها */}
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewLabel({ name: '', color: 'blue' });
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-light-text dark:text-dark-text transition-colors"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  disabled={!newLabel.name.trim()}
                  className="px-3 py-1.5 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ایجاد
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabelPicker;
