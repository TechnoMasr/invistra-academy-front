import api from "./api";

export const getMyCourses = async (filters = {}) => {
  const { data } = await api.get("/student-profile/my-courses", {
    params: filters,
  });
  return data?.data || {};
};
export const getMyCertificates = async () => {
  const { data } = await api.get("/student-profile/certificates");
  return data?.data || [];
};
