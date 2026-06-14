import api from "./api";

export const getCoursesPage = async (filters) => {
  const { data } = await api.get(`/courses`, { params: filters });
  return data;
};

export const getCategoriesList = async () => {
  const { data } = await api.get(`/categories/list`);
  return data?.data;
};

export const getInstructorsList = async () => {
  const { data } = await api.get(`/instructors/list`);
  return data?.data;
};

export const getCourseDetails = async (id) => {
  const { data } = await api.get(`/courses/${id}`);
  return data?.data || null;
};
