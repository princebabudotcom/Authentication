export default function Skeleton({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 ${rounded} ${className}`}
    />
  );
}
