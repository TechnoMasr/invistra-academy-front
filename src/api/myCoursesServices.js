import api from "./api";

export const getMyCoursesStudent = async (filters = {}) => {
  const { data } = await api.get("/student-profile/my-courses", {
    params: filters,
  });
  return data?.data || {};
};

export const getMyCertificates = async (filters = {}) => {
  const { data } = await api.get("/student-profile/certificates", {
    params: filters,
  });
  return data?.data || {};
};

// ++++++++++++++++ instructor ++++++++++++++++
export const getMyCoursesInstructor = async (filters = {}) => {
  const { data } = await api.get("/instructor-profile/courses", {
    params: filters,
  });
  return data?.data || {};
};

export const getMyCourseDetailsInstructor = async (id) => {
  const { data } = await api.get(`/instructor-profile/courses/${id}`);
  return data?.data || {};
};

export const createCourse = async (formData) => {
  const { data } = await api.post("/instructor-profile/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data?.data || null;
};

export const updateCourse = async (formData, id) => {
  const { data } = await api.post(
    "/instructor-profile/courses/" + id,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data?.data || null;
};

export const deleteCourse = async (id) => {
  const { data } = await api.delete(`/instructor-profile/courses/${id}`);
  return data?.data || null;
};
