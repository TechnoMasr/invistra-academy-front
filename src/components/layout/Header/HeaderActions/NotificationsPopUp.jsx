import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaRegBell } from "react-icons/fa";
import NotificationsSkeleton from "@/components/Loading/SkeletonLoading/NotificationsSkeleton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications, getUnreadCount } from "@/api/notificationsServices";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import NotificationCard from "@/components/cards/NotificationCard";
import useNotificationsPolling from "@/hooks/useNotificationsPolling";
import { useTranslation } from "react-i18next";

const NotificationsPopUp = () => {
  const { t } = useTranslation();
  const [openNotifications, setOpenNotifications] = useState(false);
  const { user } = useSelector((state) => state.user);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    enabled: !!user,
  });

  const { data: unreadNotifications = 0 } = useQuery({
    queryKey: ["unread-count"],
    queryFn: getUnreadCount,
    enabled: !!user,
  });

  // استخراج اخر id
  const lastId =
    notifications?.items && notifications.items.length > 0
      ? notifications.items[0].id
      : null;

  // تشغيل polling
  useNotificationsPolling({ lastId, user });

  return (
    <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
      <PopoverTrigger asChild>
        <div className="relative">
          <FaRegBell className="header_icon" />
          {unreadNotifications > 0 && (
            <span
              className="absolute -top-2 -inset-e-1 bg-secondary text-primary text-sm rounded-full w-4 h-4 
            flex items-center justify-center"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent align="end" className="md:w-96">
        {isLoading ? (
          <NotificationsSkeleton />
        ) : notifications?.items?.length ? (
          <div className="flex flex-col gap-2 max-h-100 overflow-y-auto custom_scrollbar">
            {notifications.items.slice(0, 3).map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                header
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-6">
            {t("NotificationsPopUp.notFound")}
          </p>
        )}

        {notifications?.items?.length > 0 && (
          <Link
            className="block mt-4"
            to="/profile/notifications"
            onClick={() => setOpenNotifications(false)}
          >
            <Button className="w-full">{t("NotificationsPopUp.seeAll")}</Button>
          </Link>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopUp;
