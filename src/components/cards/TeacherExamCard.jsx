import { useState } from "react";
import { SlLayers } from "react-icons/sl";
import { Link, useParams } from "react-router"; // جلب الـ id من الرابط إذا لزم الأمر
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { RiErrorWarningLine } from "react-icons/ri";
import { PiExam } from "react-icons/pi";

// استيراد مكونات الـ Dialog من Shadcn
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

  // إعداد mutation حذف الاختبار
  const { mutate: handleDeleteExam, isPending } = useMutation({
    mutationFn: (examId) => deleteExam(examId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["examsInstructor"],
      });

      toast.success("تم حذف الاختبار بنجاح");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حذف الاختبار",
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
        <RiErrorWarningLine /> يجب ان يتجاوز {item?.pass_mark} للنجاح
      </p>

      <p className="text-sm flex items-center gap-1 font-semibold text-orange-600">
        <PiExam />
        درجة الاختبار من {item?.full_mark}
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

      <Link
        to={`/profile/edit-exam/${item?.id}`}
        className="flex-1 rounded-full"
      >
        <Button variant="outline" className="w-full">
          عرض تفاصيل الاختبار
        </Button>
      </Link>

      {/* دمج الـ Dialog لتأكيد حذف الاختبار */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" disabled={isPending}>
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "حذف الاختبار"
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-right">حذف الاختبار</DialogTitle>
            <DialogDescription className="text-right mt-2">
              هل أنت متأكد من رغبتك في حذف اختبار{" "}
              <span className="font-bold text-foreground">"{item?.title}"</span>
              ؟ لا يمكن التراجع عن هذا الإجراء بعد إتمامه.
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
                "تأكيد الحذف"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherExamCard;
