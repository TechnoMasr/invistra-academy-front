import { Skeleton } from "@/components/ui/skeleton";

const NotificationsSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-2 py-2 px-4 border-b last:border-b-0 rounded-lg bg-muted"
        >
          {/* Icon */}
          <Skeleton className="w-10 h-10 rounded-full" />

          {/* Text */}
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsSkeleton;
