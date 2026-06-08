import api from "./api";

export const getCartHero = async () => {
  const { data } = await api.get(`/orders/hero/section`);

  return data?.data || [];
};

export const getCart = async () => {
  const { data } = await api.get(`/orders/my-carts`);

  return data?.data || [];
};

export const addToCart = async (formData) => {
  const { data } = await api.post(`/orders/add-to-cart`, formData);

  return data?.data || null;
};

export const removeFromCart = async (id) => {
  const { data } = await api.delete(`/orders/cart-items/${id}`);

  return data?.data || null;
};

export const updateCart = async ({ id, quantity }) => {
  const { data } = await api.post(`/orders/cart-items/${id}`, { quantity });

  return data?.data || null;
};

export const confirmOrder = async (formData) => {
  const { data } = await api.post(`/orders/confirm`, formData);

  return data?.data || null;
};

export const getOrders = async (status, page = 1) => {
  const url =
    status && status !== "all"
      ? `/orders/my-orders?status=${status}&page=${page}`
      : `/orders/my-orders?page=${page}`;

  const { data } = await api.get(url);

  return data?.data || [];
};

export const getOrdersStatus = async () => {
  const { data } = await api.get(`/orders/statuses`);

  return data?.data || [];
};

export const getCartItemsCount = async () => {
  const { data } = await api.get(`/orders/cart-items-count`);

  return data?.data || [];
};
