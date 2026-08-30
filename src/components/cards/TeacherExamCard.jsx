import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  AlertCircle,
  Layers,
} from "lucide-react";
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
import { deleteExam } from "@/api/ExamServices";

const TeacherExamCard = ({ item }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const isFinal = item?.exam_type === "final";

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
    <div className="group relative border rounded-xl p-4 flex flex-col gap-3 bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header Badges: نوع الاختبار والفئة */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isFinal
              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
          }`}
        >
          {isFinal ? (
            <>
              <GraduationCap className="w-3.5 h-3.5" />
              {t("teacherExamCard.finalExam")}
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5" />
              {t("teacherExamCard.lectureExam")}
            </>
          )}
        </span>

        {item?.category && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white! bg-secondary px-2 py-0.5 rounded-md">
            <Layers className="w-3 h-3" />
            {item?.category}
          </span>
        )}
      </div>

      {/* Title & Course Name */}
      <div className="space-y-1">
        <h3 className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
          {item?.title}
        </h3>
        <p className="text-xs font-medium text-muted-foreground line-clamp-1">
          {item?.course_name}
        </p>
      </div>

      {/* اسم المحاضرة إذا كان الاختبار على محاضرة */}
      {!isFinal && item?.lecture_name && (
        <div className="text-xs bg-muted/70 px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5">
          <span className="font-semibold text-foreground shrink-0">
            {t("teacherExamCard.lectureLabel")}:
          </span>
          <span className="truncate">{item?.lecture_name}</span>
        </div>
      )}

      {/* Stats Grid: درجات ووقت الاختبار منظم بشكل كروت صغيرة */}
      <div className="grid grid-cols-3 gap-2 py-1 text-sm mt-auto">
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Award className="w-5 h-5 mb-1" />
          <span className="opacity-80">
            {t("teacherExamCard.fullMarkShort")}
          </span>
          <span className="font-bold">{item?.full_mark}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 mb-1" />
          <span className="opacity-80">
            {t("teacherExamCard.passMarkShort")}
          </span>
          <span className="font-bold">{item?.pass_mark}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-sky-500/5 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <Clock className="w-5 h-5 mb-1" />
          <span className="opacity-80">
            {t("teacherExamCard.durationShort")}
          </span>
          <span className="font-bold">
            {item?.duration} {t("teacherExamCard.minutes")}
          </span>
        </div>
      </div>

      {/* Instructor Info */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="w-10 h-10 overflow-hidden rounded-full border bg-muted shrink-0">
          {item?.instructor_image ? (
            <img
              loading="lazy"
              src={item?.instructor_image}
              alt={item?.instructor_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
              {item?.instructor_name?.charAt(0)}
            </div>
          )}
        </div>
        <span className="text-sm font-medium truncate">
          {item?.instructor_name}
        </span>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center gap-2 pt-2">
        <Link
          to={`/profile/edit-exam/${item?.id}`}
          className={`flex-1 text-sm ${buttonVariants({ variant: "outline", size: "sm" })}`}
        >
          {t("teacherExamCard.viewExamDetails")}
        </Link>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              className="flex-1 text-sm"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-3.5 w-3.5" />
              ) : (
                t("teacherExamCard.deleteExam")
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md" showCloseButton={false}>
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
