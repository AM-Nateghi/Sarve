// کامپوننت Loading Spinner
const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-light-border dark:border-dark-border border-t-primary-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
