import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Dropdown = ({ value, onChange, options, placeholder = 'انتخاب کنید', label }) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border py-2 pr-10 pl-3 text-right focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all">
            <span className={`block truncate ${!selectedOption ? 'text-light-text-tertiary dark:text-dark-text-tertiary' : 'text-light-text dark:text-dark-text'}`}>
              {selectedOption?.label || placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronDownIcon
                className="h-5 w-5 text-light-text-tertiary dark:text-dark-text-tertiary"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border shadow-lg focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pr-10 pl-4 ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-primary-100'
                        : 'text-light-text dark:text-dark-text'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-600 dark:text-primary-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
