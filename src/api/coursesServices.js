import api from "./api";

export const getCoursesPage = async (filters) => {
  const { data } = await api.get(`/courses`, { params: filters });
  return data;
};

export const getCourseDetails = async (slug) => {
  const { data } = await api.get(`/courses/${slug}`);
  return data?.data || null;
};
