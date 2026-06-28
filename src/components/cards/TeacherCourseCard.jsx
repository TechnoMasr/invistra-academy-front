import { useState } from "react";
import { FaBoxOpen } from "react-icons/fa";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteCourse } from "@/api/myCoursesServices";

const TeacherCourseCard = ({ item }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // إعداد الـ Mutation الخاص بحذف الكورس
  const { mutate: handleDeleteCourse, isPending } = useMutation({
    mutationFn: (courseId) => deleteCourse(courseId),
    onSuccess: () => {
      // قم بتحديث الـ Query key المسؤول عن جلب كورسات المدرس (عدله حسب الـ key عندك مثلاً "teacherCourses")
      queryClient.invalidateQueries({ queryKey: ["myCoursesTeacher"] });
      toast.success(t("teacherCourseCard.deleteSuccess"));
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || t("teacherCourseCard.deleteError"),
      );
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white p-3 flex flex-col justify-between gap-3">
      <div className="flex flex-col xs:flex-row items-start gap-3">
        <div className="w-full h-50 xs:w-36 xs:h-36 md:w-30 md:h-30 xl:w-40 xl:h-40 aspect-square shrink-0 rounded-md overflow-hidden border">
          {item?.image && (
            <img
              loading="lazy"
              src={item?.image}
              alt={item?.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="w-full flex flex-col gap-2 lg:gap-2">
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
            ) : null}
            <span className="text-2xl font-bold text-green-500">
              {item?.price} {item?.currency}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link to={`/profile/add-lecture/${item?.id}`} className="rounded-full">
          <Button className="w-full">
            {t("teacherCourseCard.addLecture")}
          </Button>
        </Link>
        <Link to={`/profile/lectures/${item?.id}`} className="rounded-full">
          <Button variant="outline" className="w-full">
            {t("teacherCourseCard.viewLectures")}
          </Button>
        </Link>
        <Link
          to={`/profile/edit-course/${item?.id}`}
          className={`rounded-full ${item?.is_purchased && "sm:col-span-2"}`}
        >
          <Button variant="outline" className="w-full">
            {t("teacherCourseCard.viewCourseDetails")}
          </Button>
        </Link>

        {/* تفعيل الحذف فقط إذا كان مسموحاً حذف الكورس */}
        {!item?.is_purchased && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  t("teacherCourseCard.deleteCourse")
                )}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle className="text-right">
                  {t("teacherCourseCard.deleteTitle")}
                </DialogTitle>
                <DialogDescription className="text-right mt-2">
                  {t("teacherCourseCard.deleteDescription", {
                    name: item?.name,
                  })}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleDeleteCourse(item?.id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    t("teacherCourseCard.confirmDelete")
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  {t("teacherCourseCard.cancel")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseCard;
