import api from "./api";

export const getCart = async (payment_method) => {
  const url = payment_method
    ? `/cart?payment_method=${payment_method}`
    : `/cart`;

  const { data } = await api.get(url);

  return data?.data || [];
};

export const addToCart = async (id) => {
  const { data } = await api.post(`/cart`, {
    course_id: id,
  });

  return data?.data || null;
};

export const removeFromCart = async (id) => {
  const { data } = await api.delete(`/cart/${id}`);

  return data?.data || null;
};

export const getCartSummary = async (payment_method) => {
  const { data } = await api.get(
    `/cart/summary?payment_method=${payment_method}`,
  );

  return data?.data || null;
};

export const getCartItemsCount = async () => {
  const { data } = await api.get(`/cart/count`);

  return data?.data || [];
};

export const createOrder = async (formData) => {
  const { data } = await api.post(`/orders`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data?.data || null;
};
