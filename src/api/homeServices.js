import api from "./api";

export const getHome = async () => {
  const { data } = await api.get("/home");
  return data?.data || {};
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data?.data || [];
};

export const getCourses = async (id) => {
  const url = id ? `/courses/category/${id}` : "/courses/category";

  const { data } = await api.get(url);

  return data?.data || [];
};
