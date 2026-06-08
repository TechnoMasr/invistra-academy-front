import { readNotification } from "@/api/notificationsServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaRegBell } from "react-icons/fa";

const NotificationCard = ({ notification }) => {
  const queryClient = useQueryClient();

  const { mutate: markAsRead, isPending } = useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleRead = (notification) => {
    if (!notification.read_at) {
      markAsRead(notification.id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      key={notification.id}
      onClick={() => handleRead(notification)}
      className={`flex gap-2 py-2 px-4 cursor-pointer transition rounded-md
              ${
                notification.read_at
                  ? "bg-muted border"
                  : "bg-primary text-white"
              }
              ${
                isPending
                  ? "animate-pulse"
                  : "hover:brightness-90 active:brightness-90"
              }
            `}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full text-2xl
                ${
                  notification.read_at
                    ? "bg-white text-muted-foreground"
                    : "bg-white text-primary"
                }
              `}
      >
        <FaRegBell />
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-medium">{notification.title}</h3>
        <p className="text-sm opacity-70">{notification.message}</p>
        <p className="text-xs opacity-70">
          {formatDate(notification.notification_date)}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
