import api from "./api";

export const getFavorites = async (page = 1) => {
  const { data } = await api.get("/favorites", {
    params: {
      page,
    },
  });

  return data?.data;
};

export const toggleFavorite = async ({ id, sale_type }) => {
  const { data } = await api.post("/favorites", { id, sale_type });
  return data?.data || null;
};
