import NotificationCard from "@/components/cards/NotificationCard";
import SectionTitle from "@/components/common/SectionTitle";
import EmptyDataSection from "@/components/commonSections/EmptyDataSection";
import NotificationsSkeleton from "@/components/Loading/SkeletonLoading/NotificationsSkeleton";
import { Button } from "@/components/ui/button";

import {
  getNotifications,
  readAllNotifications,
} from "@/api/notificationsServices";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import MainPagination from "@/components/common/MainPagination";
import { useSearchParams } from "react-router";

const Notifications = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page),
  });

  const isEmpty =
    !isLoading && (notifications?.items?.length === 0 || !notifications);

  const { mutate: markAllAsRead, isPending } = useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
    },
  });

  const hasUnread = notifications?.items?.some((item) => item.read_at === null);

  return (
    <div>
      <div className="flex items-start justify-between">
        <SectionTitle title={t("notifications.title")} />

        {hasUnread && (
          <Button disabled={isPending} onClick={markAllAsRead}>
            {isPending
              ? t("notifications.loading")
              : t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      {isLoading ? (
        <NotificationsSkeleton />
      ) : isEmpty ? (
        <EmptyDataSection msg={t("notifications.empty")} />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications?.items?.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}

      <MainPagination
        totalPages={notifications?.meta?.last_page}
        currentPage={page}
        onPageChange={(newPage) => {
          setSearchParams({ page: newPage });
        }}
      />
    </div>
  );
};

export default Notifications;
