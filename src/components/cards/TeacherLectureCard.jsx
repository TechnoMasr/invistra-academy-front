import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Link, useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "../ui/button";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { deleteLecture } from "@/api/lectureServices";

const TeacherLectureCard = ({ item }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { t } = useTranslation();

  const { mutate: handleDeleteLecture, isPending } = useMutation({
    mutationFn: (lectureId) => deleteLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lecturesInstructor", id],
      });

      toast.success(t("teacherLectureCard.deleteSuccess"));
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || t("teacherLectureCard.deleteError"),
      );
    },
  });

  return (
    <div className="border rounded-lg flex justify-between flex-wrap gap-3 p-3 hover:bg-primary/10 hover:border-primary transition duration-300 ease-in-out">
      <div className="flex items-center gap-2">
        <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
          <FaPlay />
        </span>

        <h3 className="text-lg font-semibold">
          {item?.index} - {item?.title}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/profile/edit-lecture/${item?.id}`}
          className={`${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          {t("teacherLectureCard.viewLectureDetails")}
        </Link>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                t("teacherLectureCard.deleteLecture")
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="text-right">
                {t("teacherLectureCard.deleteTitle")}
              </DialogTitle>
              <DialogDescription className="text-right mt-2">
                {t("teacherLectureCard.deleteDescription", {
                  name: item?.title,
                })}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
              <Button
                type="button"
                variant="destructive"
                className="flex-1 sm:flex-none"
                onClick={() => handleDeleteLecture(item?.id)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  t("teacherLectureCard.confirmDelete")
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("teacherLectureCard.cancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeacherLectureCard;
