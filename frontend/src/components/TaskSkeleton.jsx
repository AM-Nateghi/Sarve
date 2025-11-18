const TaskSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-5 border border-light-border dark:border-dark-border animate-pulse"
        >
          <div className="flex items-start gap-4">
            {/* Drag Handle Skeleton */}
            <div className="w-5 h-5 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded mt-1" />

            {/* Checkbox Skeleton */}
            <div className="w-6 h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full mt-1" />

            {/* Content Skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-full" />
                <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded w-5/6" />
              </div>

              {/* Meta Info (Priority, Date, Labels) */}
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full" />
                <div className="h-6 w-24 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full" />
                <div className="h-6 w-20 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full" />
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg" />
              <div className="w-9 h-9 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TaskSkeleton;
