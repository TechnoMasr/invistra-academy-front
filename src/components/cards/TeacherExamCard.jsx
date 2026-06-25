import { useState } from "react";
import { SlLayers } from "react-icons/sl";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { RiErrorWarningLine, RiTimerLine } from "react-icons/ri";
import { PiExam } from "react-icons/pi";
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
import { deleteExam } from "@/api/ExamServices";

const TeacherExamCard = ({ item }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: handleDeleteExam, isPending } = useMutation({
    mutationFn: (examId) => deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["examsInstructor"],
      });

      toast.success(t("teacherExamCard.deleteSuccess"));
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || t("teacherExamCard.deleteError"),
      );
    },
  });

  return (
    <div key={item?.id} className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-lg font-bold line-clamp-2">{item?.title}</h3>

      <p className="opacity-70 font-medium line-clamp-2">{item?.course_name}</p>

      <p className="text-sm flex items-center gap-1 font-semibold">
        <SlLayers />
        {item?.category}
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-amber-500">
        <RiErrorWarningLine />{" "}
        {t("teacherExamCard.passMark", { mark: item?.pass_mark })}
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-orange-600">
        <PiExam />
        {t("teacherExamCard.examScore", { mark: item?.full_mark })}
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-sky-600">
        <RiTimerLine />
        {t("teacherExamCard.time", { time: item?.duration })}
      </p>

      <div className="flex items-center gap-2">
        <div className="w-8 aspect-square overflow-hidden rounded-full">
          <img
            loading="lazy"
            src={item?.instructor_image}
            alt={item?.instructor_name}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-medium">{item?.instructor_name}</h4>
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <Link
          to={`/profile/edit-exam/${item?.id}`}
          className="flex-1 rounded-full"
        >
          <Button variant="outline" className="w-full">
            {t("teacherExamCard.viewExamDetails")}
          </Button>
        </Link>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="flex-1">
            <Button
              variant="destructive"
              disabled={isPending}
              className={`w-full`}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                t("teacherExamCard.deleteExam")
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-106" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle className="text-right">
                {t("teacherExamCard.deleteTitle")}
              </DialogTitle>
              <DialogDescription className="text-right mt-2">
                {t("teacherExamCard.deleteDescription", { name: item?.title })}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
              <Button
                type="button"
                variant="destructive"
                className="flex-1 sm:flex-none"
                onClick={() => handleDeleteExam(item?.id)}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  t("teacherExamCard.confirmDelete")
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t("teacherExamCard.cancel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TeacherExamCard;
