import { useState, useRef, useEffect } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const CustomDropdown = ({ value, onChange, options, placeholder = 'انتخاب کنید', label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  // بستن dropdown وقتی بیرون کلیک میشه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full cursor-pointer rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border py-2 pr-10 pl-3 text-right focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        >
          <span className={`block truncate ${!selectedOption ? 'text-light-text-tertiary dark:text-dark-text-tertiary' : 'text-light-text dark:text-dark-text'}`}>
            {selectedOption?.label || placeholder}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDownIcon
              className={`h-5 w-5 text-light-text-tertiary dark:text-dark-text-tertiary transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </span>
        </button>

        {/* Options */}
        {isOpen && (
          <div className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border shadow-lg">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`relative w-full cursor-pointer select-none py-2 pr-10 pl-4 text-right transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                      : 'text-light-text dark:text-dark-text hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                  }`}
                >
                  <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>
                  {isSelected && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
