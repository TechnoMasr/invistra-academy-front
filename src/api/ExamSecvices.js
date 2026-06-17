import api from "./api";

export const getInstructorCoursesForExams = async () => {
  const { data } = await api.get("/instructor-profile/courses-list");
  return data?.data || [];
};

export const getExamsInstructor = async (filters = {}) => {
  const { data } = await api.get("/instructor-profile/exams", {
    params: filters,
  });
  return data?.data || [];
};

export const getExamDetailsInstructor = async (id) => {
  const { data } = await api.get(`/instructor-profile/exams/${id}`);
  return data?.data || null;
};

export const addExam = async (formData, id) => {
  const { data } = await api.post(
    `/instructor-profile/courses/${id}/exams`,
    formData,
  );
  return data?.data || null;
};

export const updateExam = async (formData, id) => {
  const { data } = await api.post(`/instructor-profile/exams/${id}`, formData);
  return data?.data || null;
};

export const deleteExam = async (id) => {
  const { data } = await api.delete(`/instructor-profile/exams/${id}`);
  return data?.data || null;
};
