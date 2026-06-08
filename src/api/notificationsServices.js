import api from "./api";

export const getNotifications = async (page = 1) => {
  const { data } = await api.get("/custom-notifications", {
    params: { page },
  });
  return data?.data;
};

export const getNewNotifications = async (last_id) => {
  const { data } = await api.get(
    `/custom-notifications/new?last_id=${last_id}`,
  );
  return data?.data || [];
};

export const readNotification = async (id) => {
  const { data } = await api.post(`/custom-notifications/mark-read/${id}`);
  return data?.data || null;
};

export const readAllNotifications = async () => {
  const { data } = await api.post(`/custom-notifications/mark-all-read`);
  return data?.data || null;
};

export const deleteNotification = async (id) => {
  const { data } = await api.delete(`/custom-notifications/${id}`);
  return data?.data || null;
};

export const getUnreadCount = async () => {
  const { data } = await api.get(`/custom-notifications/unread-count`);

  return data?.data || [];
};
