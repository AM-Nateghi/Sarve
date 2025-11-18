import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Section Skeleton */}
      <div className="space-y-4">
        <Skeleton height="2.5rem" width="50%" />
        <Skeleton height="1.5rem" width="70%" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 border border-light-border dark:border-dark-border"
          >
            <div className="flex items-center justify-between mb-4">
              <Skeleton circle width="3rem" height="3rem" />
              <Skeleton width="4rem" height="1.5rem" />
            </div>
            <Skeleton height="2.5rem" width="60%" className="mb-2" />
            <Skeleton height="1rem" width="80%" />
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 border border-light-border dark:border-dark-border">
        <Skeleton height="1.5rem" width="10rem" className="mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <Skeleton height="3rem" className="mb-2" />
              <Skeleton height="1rem" width="80%" />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Tasks Skeleton */}
      <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl p-6 border border-light-border dark:border-dark-border">
        <Skeleton height="1.5rem" width="10rem" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary"
            >
              <Skeleton circle width="1.5rem" height="1.5rem" />
              <div className="flex-1">
                <Skeleton height="1rem" width="70%" className="mb-2" />
                <Skeleton height="0.75rem" width="40%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
