import { HiOutlineCollection } from "react-icons/hi";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const CourseCard = ({ course }) => {
  const { t } = useTranslation();
  return (
    <Link
      to={`/courses/${course?.slug}`}
      key={course?.id}
      className="border rounded-lg overflow-hidden bg-white hover:shadow-xl hover:border-primary hover:bg-gray-100 transition duration-300 ease-in-out
      flex flex-col"
    >
      <div className="w-full aspect-5/3 overflow-hidden">
        {course?.image && (
          <img
            loading="lazy"
            src={course?.image}
            alt={course?.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 lg:gap-4 p-4 flex-1">
        <h3 className="text-2xl font-bold line-clamp-2">{course?.name}</h3>

        <div
          className="rich_content line-clamp-2"
          dangerouslySetInnerHTML={{ __html: course?.description }}
        />

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden border rounded-full">
            {course?.instructor.image && (
              <img
                loading="lazy"
                src={course?.instructor.image}
                alt={course?.instructor.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h4 className="font-medium">{course?.instructor.name}</h4>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
          <div className="flex items-center gap-2 py-1 px-4 border border-primary rounded-full text-xs font-semibold">
            <HiOutlineCollection size={18} />
            {t("courseCard.lecturesCount", { count: course?.lectures_count })}
          </div>

          <div>
            {course?.price_before_discount ? (
              <p className="text-lg font-bold text-red-500 line-through">
                {course?.price_before_discount} {course?.currency}
              </p>
            ) : null}

            <p className="text-2xl font-bold text-green-500">
              {course?.price} {course?.currency}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
