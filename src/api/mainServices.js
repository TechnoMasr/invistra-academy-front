import api from "./api";

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data?.data || [];
};

export const getFooter = async () => {
  const { data } = await api.get("/footer");
  return data?.data || {};
};

export const sendContactUs = async (formData) => {
  const { data } = await api.post(`/contact`, formData);
  return data?.data || [];
};

export const sendSearch = async (search) => {
  const { data } = await api.get(`/search?search=${search}`);
  return data?.data || [];
};

export const getPages = async (slug) => {
  const { data } = await api.get(`/page/${slug}`);
  return data?.data || [];
};

export const getCategoriesList = async () => {
  const { data } = await api.get(`/categories/list`);
  return data?.data;
};

export const getInstructorsList = async () => {
  const { data } = await api.get(`/instructors/list`);
  return data?.data;
};
