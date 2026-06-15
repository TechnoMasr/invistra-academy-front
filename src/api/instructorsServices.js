import api from "./api";

export const getInstructorsPage = async (filters = {}) => {
  const { data } = await api.get(`/instructors`, {
    params: filters,
  });
  return data;
};

export const getInstructorDetails = async (slug) => {
  const { data } = await api.get(`/instructors/${slug}`);
  return data?.data || null;
};
