import CourseCardSkeleton from "./CourseCardSkeleton";

const CoursesPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <CourseCardSkeleton key={idx}/>
      ))}
    </div>
  );
};

export default CoursesPageSkeleton;
