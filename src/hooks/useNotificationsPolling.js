import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNewNotifications } from "@/api/notificationsServices";

const useNotificationsPolling = ({ lastId, user }) => {
  const queryClient = useQueryClient();
  const initializedRef = useRef(false);

  // تجهيز الصوت مرة واحدة فقط
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.wav");
  }, []);

  const { data: newNotifications } = useQuery({
    queryKey: ["new-notifications", lastId],
    queryFn: () => getNewNotifications(lastId),
    enabled: !!user && !!lastId,
    refetchInterval: 20000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    if (newNotifications && newNotifications.length > 0) {
      // تشغيل الصوت
      audioRef.current?.play().catch(() => {});

      // تحديث الكاش القديم
      queryClient.setQueryData(["notifications"], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          items: [...newNotifications, ...oldData.items],
        };
      });

      // تحديث unread count لو حابب تزوده مباشرة
      queryClient.invalidateQueries({
        queryKey: ["unread-count"],
      });
    }
  }, [newNotifications, queryClient]);
};

export default useNotificationsPolling;
