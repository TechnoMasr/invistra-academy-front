import api from "./api";

export const getAboutPage = async () => {
  const { data } = await api.get("/about-us");
  return data?.data || [];
};

export const getSettings = async () => {
  const { data } = await api.get("/settings");
  return data?.data || [];
};

export const getSimpleCategories = async () => {
  const { data } = await api.get("/simple-categories");
  return data?.data || [];
};

export const getEmirates = async () => {
  const { data } = await api.get("/emirates");
  return data?.data || [];
};

export const getFooter = async () => {
  const { data } = await api.get("/footer-and-social-links");
  return data?.data || {};
};

export const sendContactUs = async (formData) => {
  const { data } = await api.post(`/contact`, formData);
  return data?.data || [];
};

export const getContactInformation = async () => {
  const { data } = await api.get(`/contact-information`);
  return data?.data || [];
};

export const getLocationSliders = async () => {
  const { data } = await api.get(`/sliders`);
  return data?.data || [];
};

export const getBestSelling = async () => {
  const { data } = await api.get(`/products/best-selling`);
  return data?.data || [];
};

export const getStrips = async () => {
  const { data } = await api.get(`/strips`);
  return data?.data || [];
};
