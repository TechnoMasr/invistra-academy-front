import { useState } from "react";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { MdOutlineDelete } from "react-icons/md";
import { SlLayers } from "react-icons/sl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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

import { removeFromCart } from "@/api/cartServices";

const CartCard = ({ item, course_id }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { mutate: handleDeleteItem, isPending } = useMutation({
    mutationFn: (courseId) => removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartItemsCount"] });
      toast.success(t("cartCard.deleteSuccess"));
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || t("cartCard.deleteError"));
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white flex flex-col sm:flex-row items-start gap-4 p-4">
      <div className="w-full sm:w-40 md:w-64 aspect-6/4 shrink-0 border rounded-md overflow-hidden">
        {item.image && (
          <img
            loading="lazy"
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 w-full">
        <h3 className="text-lg lg:text-xl font-bold line-clamp-2">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium text-sm mb-2 text-muted-foreground">
          <p className="flex items-center gap-1">
            <HiOutlineSquares2X2 />
            {t("cartCard.lecturesCount", { count: item.lectures_count })}
          </p>
          <p className="flex items-center gap-1">
            <SlLayers />
            {item.category}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 overflow-hidden rounded-full border shrink-0">
            {item.instructor?.image && (
              <img
                loading="lazy"
                src={item.instructor.image}
                alt={item.instructor.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h4 className="font-medium text-sm">{item.instructor?.name}</h4>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-2 pt-2 border-t border-gray-50 mt-auto">
          <div>
            {item?.price_before_discount ? (
              <p className="text-sm font-semibold text-red-500 line-through">
                {item?.price_before_discount} {item?.currency}
              </p>
            ) : null}
            <p className="text-2xl font-bold text-green-500">
              {item.price} {item.currency}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                disabled={isPending}
                className="flex items-center gap-1 text-destructive bg-destructive/10 hover:bg-destructive/20 px-4 py-2 text-sm font-medium rounded-full cursor-pointer transition disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    {t("cartCard.delete")}{" "}
                    <MdOutlineDelete className="text-lg" />
                  </>
                )}
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle className="text-right">
                  {t("cartCard.deleteTitle")}
                </DialogTitle>
                <DialogDescription className="text-right mt-2">
                  {t("cartCard.deleteDescription", { name: item.name })}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1 sm:flex-none"
                  onClick={() => handleDeleteItem(course_id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-4 w-4" />
                  ) : (
                    t("cartCard.confirmDelete")
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  {t("cartCard.cancel")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
