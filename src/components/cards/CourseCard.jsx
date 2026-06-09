import { HiOutlineCollection } from "react-icons/hi";
import { Link } from "react-router";

const CourseCard = ({ course }) => {
  return (
    <Link
      to={`/courses/${course.slug}`}
      key={course.id}
      className="border rounded-lg overflow-hidden bg-white hover:shadow-xl hover:border-primary hover:bg-primary/5 transition duration-300 ease-in-out"
    >
      <div className="w-full aspect-5/3 overflow-hidden">
        <img
          loading="lazy"
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 lg:gap-4 p-4">
        <h3 className="text-2xl font-bold line-clamp-2">{course.title}</h3>

        <p className="line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden rounded-full">
            <img
              loading="lazy"
              src={course.teacher.image}
              alt={course.teacher.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-medium">{course.teacher.name}</h4>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold">
            <HiOutlineCollection size={18} />
            {course.lecture_number} محاضرة
          </div>

          <p className="text-2xl font-bold text-green-500">${course.price}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
