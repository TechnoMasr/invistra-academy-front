import api from "./api";

export const getInstructorsPage = async (filters = {}) => {
  const { data } = await api.get(`/instructors`, {
    params: filters,
  });
  return data;
};

export const getInstructorDetails = async (id) => {
  const { data } = await api.get(`/instructors/${id}`);
  return data?.data || null;
};
