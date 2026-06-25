import { FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const TeacherCourseCard = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-lg overflow-hidden bg-white flex items-start gap-3 p-3">
      <div className="w-1/3 aspect-square rounded-md overflow-hidden border">
        {item?.image && (
          <img
            loading="lazy"
            src={item?.image}
            alt={item?.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <h3 className="text-lg font-bold line-clamp-2">{item?.name}</h3>

        <p className="line-clamp-2 text-sm">{item?.description}</p>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 aspect-square overflow-hidden border rounded-full">
              {item?.instructor_image && (
                <img
                  loading="lazy"
                  src={item?.instructor_image}
                  alt={item?.instructor_name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h4 className="font-medium">{item?.instructor_name}</h4>
          </div>

          <p className="font-medium text-xs py-1 px-4 text-green-500 border border-green-500 rounded-full flex items-center gap-1">
            <FaBoxOpen />
            {t("teacherCourseCard.orders", { count: item?.orders_count })}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-1">
          <p className="font-semibold">{t("teacherCourseCard.price")}</p>

          {item?.price_before_discount ? (
            <p className="text-lg font-bold text-red-500 line-through">
              {item?.price_before_discount} {item?.currency}
            </p>
          ): null}
          <span className="text-2xl font-bold text-green-500">
            {item?.price} {item?.currency}
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <Link
            to={`/profile/lectures/${item?.id}`}
            className="flex-1 rounded-full"
          >
            <Button variant="outline" className={`w-full`}>
              {t("teacherCourseCard.viewLectures")}
            </Button>
          </Link>
          <Link
            to={`/profile/edit-course/${item?.id}`}
            className="flex-1 rounded-full"
          >
            <Button variant="outline" className={`w-full`}>
              {t("teacherCourseCard.viewCourseDetails")}
            </Button>
          </Link>
          <Link
            to={`/profile/add-lecture/${item?.id}`}
            className="flex-1 rounded-full"
          >
            <Button className={`w-full`}>
              {t("teacherCourseCard.addLecture")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherCourseCard;
