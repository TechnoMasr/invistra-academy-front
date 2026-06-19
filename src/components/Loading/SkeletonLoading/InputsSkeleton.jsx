import { Skeleton } from "@/components/ui/skeleton";

const InputsSkeleton = ({ inputsCount = 10 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: inputsCount }).map((_, idx) => (
        <Skeleton key={idx} className="h-9 w-full rounded-md" />
      ))}
    </div>
  );
};

export default InputsSkeleton;
