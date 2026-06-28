import api from "./api";

export const getMyOrders = async (filters = {}) => {
  const { data } = await api.get("/student-profile/orders", {
    params: filters,
  });
  return data?.data || {};
};

export const getMyOrdersDetails = async (id) => {
  const { data } = await api.get(`/student-profile/orders/${id}`);
  return data?.data || {};
};

export const getMyLectures = async (id) => {
  const { data } = await api.get(`/student-profile/my-courses/${id}`);
  return data?.data || {};
};

export const getMyLectureDetails = async (id) => {
  const { data } = await api.get(`/student-profile/my-courses/lectures/${id}`);
  return data?.data || {};
};
