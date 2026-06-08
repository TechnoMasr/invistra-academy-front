import api from "./api";

export const getHome = async () => {
  const { data } = await api.get("/home");
  return data?.data || {};
};

export const getOurStory = async () => {
  const { data } = await api.get("/our-story");
  return data?.data || {};
};

export const getTestimonials = async () => {
  const { data } = await api.get("/testimonials-home");
  return data?.data || {};
};

export const getOurServices = async () => {
  const { data } = await api.get("/our-services");
  return data?.data || {};
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data?.data || [];
};
