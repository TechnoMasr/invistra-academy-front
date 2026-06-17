import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { Link, useParams } from "react-router"; // أو react-router-dom حسب مشروعك
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";

// استيراد مكونات الـ Dialog من Shadcn
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"; // تأكد من صحة مسار مكونات shadcn لديك
import { deleteLecture } from "@/api/lectureServices";

const TeacherLectureCard = ({ item }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { id } = useParams(); // 2. جلب الـ id من الرابط الحالي

  const { mutate: handleDeleteLecture, isPending } = useMutation({
    mutationFn: (lectureId) => deleteLecture(lectureId),
    onSuccess: () => {
      // 3. تحديث الـ queryKey ليتطابق تماماً مع صفحة العرض
      queryClient.invalidateQueries({
        queryKey: ["lecturesInstructor", id],
      });

      toast.success("تم حذف المحاضرة بنجاح");
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء حذف المحاضرة",
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
        <Link to={`/profile/edit-lecture/${item?.id}`} className="rounded-full">
          <Button variant="outline" className="w-full">
            عرض تفاصيل المحاضرة
          </Button>
        </Link>

        {/* دمج الـ Dialog لتأكيد حذف المحاضرة */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "حذف المحاضرة"
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-right">حذف المحاضرة</DialogTitle>
              <DialogDescription className="text-right mt-2">
                هل أنت متأكد من رغبتك في حذف محاضرة{" "}
                <span className="font-bold text-foreground">
                  "{item?.title}"
                </span>
                ؟ لا يمكن التراجع عن هذا الإجراء بعد إتمامه.
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
    </div>
  );
};

export default TeacherLectureCard;
