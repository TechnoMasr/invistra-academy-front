import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  MdOndemandVideo,
  MdOutlineAccessTime,
  MdOutlineOndemandVideo,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { GrCart } from "react-icons/gr";
import { IoFlashOutline } from "react-icons/io5";
import { LuLayers3 } from "react-icons/lu";

import { Loader2 } from "lucide-react";
import { addToCart } from "@/api/cartServices";
import { toast } from "sonner";
import FormError from "@/components/form/FormError";
import useRequireAuth from "@/hooks/useRequireAuth";
import useAuthGuard from "@/hooks/useAuthGuard";
import ImageSection from "./ImageSection";

const Details = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requireAuth = useRequireAuth();
  const { isInstructor } = useAuthGuard();

  const {
    mutate: handleAddToCart,
    isPending,
    error,
  } = useMutation({
    mutationFn: (courseId) => addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartItemsCount"] });
      toast(t("courseDetails.addedToCart"));
    },
  });

  const onAddToCartClick = () => {
    if (!data?.id) return;
    requireAuth(() => {
      handleAddToCart(data.id);
    });
  };

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
      label: t("courseDetails.duration"),
      value: data?.duration,
      icon: <MdOutlineAccessTime size={40} />,
    },
    {
      id: 2,
      label: t("courseDetails.lecturesCount"),
      value: data?.lectures_count,
      icon: <MdOndemandVideo size={40} />,
    },
    {
      id: 3,
      label: t("courseDetails.category"),
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
            {data?.instructor?.image && (
              <img
                loading="lazy"
                src={data?.instructor?.image}
                alt={""}
                className="w-full h-full object-cover"
              />
            )}
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

        <div className="text-lg font-bold flex items-center gap-1">
          {t("courseDetails.price")}{" "}
          {data?.price_before_discount ? (
            <p className="text-lg font-bold text-red-500 line-through">
              {data?.price_before_discount} {data?.currency}
            </p>
          ) : null}
          <p className="text-green-600 text-4xl">
            {data?.price} {data?.currency}
          </p>
        </div>

        {!isInstructor && (
          <div className="flex items-center gap-2">
            {data?.is_purchased ? (
              <Link
                to={`/profile/lectures/${data?.id}`}
                className="rounded-full flex-1"
              >
                <Button size="lg" className="w-full">
                  {t("courseDetails.showLectures")} <MdOutlineOndemandVideo />
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  size="lg"
                  className="rounded-full flex-1"
                  onClick={onAddToCartClick}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      {t("courseDetails.addToCart")} <GrCart />
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full flex-1"
                  onClick={handleBuyNow}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <>
                      {t("courseDetails.buyNow")} <IoFlashOutline />
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}

        {error && (
          <FormError
            errorMsg={
              error?.response?.data?.message ||
              t("courseDetails.somethingWrong")
            }
          />
        )}
      </div>

      <ImageSection data={data} />
    </section>
  );
};

export default Details;
