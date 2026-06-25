import api from "./api";

export const getLecturesInstructor = async (id) => {
  const { data } = await api.get(`/instructor-profile/courses/${id}/lectures`);
  return data?.data || null;
};

export const getLectureInstructorDetails = async (id) => {
  const { data } = await api.get(`/instructor-profile/lectures/${id}`);
  return data?.data || null;
};

export const addLecture = async (formData, id) => {
  const { data } = await api.post(
    `/instructor-profile/courses/${id}/lectures`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data?.data || null;
};

export const updateLecture = async (formData, id) => {
  const { data } = await api.post(
    `/instructor-profile/lectures/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data?.data || null;
};

export const deleteLecture = async (id) => {
  const { data } = await api.delete(`/instructor-profile/lectures/${id}`);
  return data?.data || null;
};

export const setShowLecture = async (id) => {
  const { data } = await api.post(
    `/student-profile/my-courses/lectures/${id}/progress`,
  );
  return data?.data || null;
};
