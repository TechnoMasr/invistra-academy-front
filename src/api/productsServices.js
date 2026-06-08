import api from "./api";

export const getProducts = async ({
  category_id,
  sub_category_id,
  sale_type,
  page = 1,
  search,
  sort_price,
}) => {
  const params = {
    sale_type,
    page,
  };

  if (category_id) params.category_id = category_id;
  if (sub_category_id) params.sub_category_id = sub_category_id;
  if (search) params.search = search;
  if (sort_price) params.sort_price = sort_price;

  const { data } = await api.get(`/products`, { params });

  return data?.data;
};

export const getProduct = async ({ slug, sale_type }) => {
  const { data } = await api.get(`/products/${slug}`, {
    params: { sale_type },
  });

  return data?.data || null;
};

export const getCategoriesHero = async () => {
  const { data } = await api.get(`/categories/hero/section`);

  return data?.data || [];
};

export const getProductsHero = async () => {
  const { data } = await api.get(`/products/hero/section`);

  return data?.data || [];
};

export const getSubCategories = async (category_id) => {
  const { data } = await api.get(`/sub-categories/${category_id}`);

  return data?.data || [];
};
