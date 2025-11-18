import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} static>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border shadow-2xl transition-all`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border">
                  <Dialog.Title className="text-xl font-bold text-light-text dark:text-dark-text">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6 text-light-text-secondary dark:text-dark-text-secondary" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
