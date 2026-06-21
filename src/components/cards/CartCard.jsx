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

const CartCard = ({ item }) => {
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
    <div className="border rounded-lg overflow-hidden bg-white flex items-start gap-4 p-4">
      <div className="w-1/3 aspect-6/4 border rounded-md overflow-hidden">
        {item.image && (
          <img
            loading="lazy"
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <h3 className="text-lg lg:text-2xl font-bold line-clamp-2">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-2 font-medium text-sm lg:text-base mb-3">
          <p className="flex items-center gap-1">
            <HiOutlineSquares2X2 />
            {t("cartCard.lecturesCount", { count: item.lectures_count })}
          </p>
          <p className="flex items-center gap-1">
            <SlLayers />
            {item.category}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden rounded-full border">
            {item.instructor?.image && (
              <img
                loading="lazy"
                src={item.instructor.image}
                alt={item.instructor.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <h4 className="font-medium">{item.instructor?.name}</h4>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-3xl font-bold text-green-500">
            {item.price} {item.currency}
          </p>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                disabled={isPending}
                className="flex items-center gap-1 text-destructive bg-destructive/20 px-4 py-1 rounded-full cursor-pointer hover:bg-destructive/30 transition disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    {t("cartCard.delete")}{" "}
                    <MdOutlineDelete className="text-xl" />
                  </>
                )}
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
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
                  onClick={() => handleDeleteItem(item.id)}
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
