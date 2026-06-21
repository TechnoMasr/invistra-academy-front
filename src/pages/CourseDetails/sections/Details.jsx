import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userImg from "@/assets/icons/Icon (1).png";

import { GoPlay } from "react-icons/go";
import { MdOndemandVideo, MdOutlineAccessTime } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { GrCart } from "react-icons/gr";
import { IoFlashOutline } from "react-icons/io5";
import { LuLayers3 } from "react-icons/lu";

import { Loader2 } from "lucide-react";
import { addToCart } from "@/api/cartServices";
import { toast } from "sonner";
import FormError from "@/components/form/FormError";
import useRequireAuth from "@/hooks/useRequireAuth";

const Details = ({ data, hideBtns = false }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requireAuth = useRequireAuth();

  const {
    mutate: handleAddToCart,
    isPending,
    error,
  } = useMutation({
    mutationFn: (courseId) => addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartItemsCount"] });
      toast("تم الإضافة بنجاح");
    },
  });

  // دالة أضف إلى السلة المحمية
  const onAddToCartClick = () => {
    if (!data?.id) return;

    requireAuth(() => {
      handleAddToCart(data.id);
    });
  };

  // دالة "اشتري الآن" المحمية
  const handleBuyNow = () => {
    if (!data?.id) return;

    requireAuth(() => {
      handleAddToCart(data.id, {
        onSuccess: () => {
          navigate("/cart");
        },
      });
    });
  };

  const list = [
    {
      id: 1,
      label: "مدة الكورس",
      value: data?.duration,
      icon: <MdOutlineAccessTime size={40} />,
    },
    {
      id: 2,
      label: "عدد المحاضرات",
      value: data?.lectures_count,
      icon: <MdOndemandVideo size={40} />,
    },
    {
      id: 3,
      label: "القسم",
      value: data?.category,
      icon: <LuLayers3 size={40} />,
    },
  ];

  return (
    <section className="container sectionPadding grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16">
      <div className="order-2 lg:order-1 space-y-4 content-center">
        <h1 className="text-2xl md:text-3xl font-bold leading-normal">
          {data?.name}
        </h1>

        <div
          className="rich_content lg:text-lg"
          dangerouslySetInnerHTML={{ __html: data?.description }}
        />

        <div className="flex items-center gap-2">
          <div className="w-10 aspect-square overflow-hidden rounded-full">
            <img
              loading="lazy"
              src={data?.instructor?.image}
              alt={""}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-medium">{data?.instructor?.name}</h4>
        </div>

        <ul className="flex flex-wrap items-center gap-4">
          {list.map((item) => (
            <li key={item.id} className="flex items-center gap-2">
              {item.icon}
              <div>
                <p className="font-bold">{item.label}</p>
                <span>{item.value}</span>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-lg font-bold">
          السعر:{" "}
          <span className="text-green-600 text-5xl">
            {data?.price} {data?.currency}
          </span>
        </p>

        {/* أزرار التحكم */}
        {!hideBtns && (
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              className="rounded-full flex-1"
              onClick={onAddToCartClick} // استخدام الدالة المحمية الجديدة
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  أضف الى السلة <GrCart />
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="rounded-full flex-1"
              onClick={handleBuyNow} // الدالة أصبحت محمية بالداخل تلقائياً
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  اشتري الان <IoFlashOutline />
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <FormError
            errorMsg={error?.response?.data?.message || "Something went wrong"}
          />
        )}
      </div>

      {data?.image && (
        <div className="aspect-6/4 rounded-xl border overflow-hidden order-1 lg:order-2 relative">
          <img
            src={data?.image}
            alt={data?.name}
            className="w-full h-full object-cover"
          />

          {data?.link && (
            <a
              href={data?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <GoPlay className="text-[100px] text-white" />
            </a>
          )}
        </div>
      )}
    </section>
  );
};

export default Details;
