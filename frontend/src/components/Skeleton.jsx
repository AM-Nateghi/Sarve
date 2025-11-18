// کامپوننت Skeleton عمومی برای نمایش بارگذاری
const Skeleton = ({ className = '', width, height, circle = false }) => {
  const baseClasses = 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary animate-pulse';
  const shapeClasses = circle ? 'rounded-full' : 'rounded';

  const style = {
    width: width || '100%',
    height: height || '1rem',
  };

  return (
    <div
      className={`${baseClasses} ${shapeClasses} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
