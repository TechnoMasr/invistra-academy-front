import PageBanner from "@/components/commonSections/PageBanner";
import CartCard from "@/components/cards/CartCard";
import OrderSummaryCard from "@/components/cards/OrderSummaryCard";
import MainInput from "@/components/form/MainInput";
import { confirmOrder, getCart, getCartHero } from "@/api/cartServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import { toast } from "sonner";
import CartPageSkeleton from "@/components/Loading/SkeletonLoading/CartSkeletonPage";
import { useTranslation } from "react-i18next";

// 🔥 form
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Cart = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ✅ schema
  const schema = z.object({
    location: z.string().min(1, t("Cart.validation.locationRequired")),
    home_num: z.string().min(1, t("Cart.validation.homeNumRequired")),
    comment: z.string().optional(),
  });

  // ✅ form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      location: "",
      home_num: "",
      comment: "",
    },
  });

  // ✅ queries
  const { data: cartHero, isLoading: isLoadingHero } = useQuery({
    queryKey: ["cartHero"],
    queryFn: getCartHero,
  });

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // ✅ mutation
  const { mutate: createOrder, isPending } = useMutation({
    mutationFn: confirmOrder,
    onSuccess: (res) => {
      // toast.success(t("Cart.orderConfirmed"));

      if (res?.payment_url) {
        window.location.href = res.payment_url;
      } else {
        toast.success(t("Cart.orderConfirmed"));
      }

      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart_count"] });

      reset();
    },
    onError: () => {},
  });

  // ✅ submit
  const onSubmit = (data) => {
    createOrder({
      location: data.location,
      home_num: data.home_num,
      comment: data.comment?.trim() || "",
    });
  };

  const isCartEmpty = !isLoading && (cart?.cart_items?.length === 0 || !cart);

  return (
    <main>
      <PageBanner
        image={cartHero?.image}
        title={t("Cart.pageTitle")}
        description={cartHero?.description}
        loading={isLoadingHero}
      />

      {isLoading ? (
        <CartPageSkeleton />
      ) : isCartEmpty ? (
        <EmptyDataSection msg={t("Cart.emptyMessage")} />
      ) : (
        <section className="container pagePadding">
          <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
            <div className="flex-1 h-full flex flex-col gap-4 justify-between">
              <div className="space-y-4">
                {cart?.cart_items?.map((item) => (
                  <CartCard key={item.id} item={item} />
                ))}
              </div>

              {/* 🔥 FORM */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* LOCATION */}
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <MainInput
                        {...field}
                        label={t("Cart.locationLabel")}
                        placeholder={t("Cart.locationPlaceholder")}
                        error={errors.location?.message}
                      />
                    )}
                  />

                  {/* HOME NUMBER */}
                  <Controller
                    name="home_num"
                    control={control}
                    render={({ field }) => (
                      <MainInput
                        {...field}
                        label={t("Cart.homeNumLabel")}
                        placeholder={t("Cart.homeNumPlaceholder")}
                        error={errors.home_num?.message}
                      />
                    )}
                  />
                </div>

                {/* COMMENT (OPTIONAL) */}
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <MainInput
                      {...field}
                      type="textarea"
                      label={t("Cart.commentLabel")}
                      placeholder={t("Cart.commentPlaceholder")}
                      error={errors.comment?.message}
                    />
                  )}
                />
              </form>
            </div>

            <OrderSummaryCard
              cart={cart}
              onConfirm={handleSubmit(onSubmit)}
              loading={isPending}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Cart;
