import api from "./api";
import Cookies from "js-cookie";

export const loginUser = async (formData) => {
  const { data } = await api.post("/auth/login", formData);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const registerUser = async (formData) => {
  const { data } = await api.post("/auth/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const logoutUser = async () => {
  const { data } = await api.post("/auth/logout");
  Cookies.remove("token");
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/profile");

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data || null;
};

export const updateProfile = async (formData) => {
  const { data } = await api.post("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const googleAuthenticate = async (formData) => {
  const { data } = await api.post("/auth/google", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const googleCompleteInstructor = async (payload) => {
  const { data } = await api.post("/auth/google/complete-instructor", payload);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const checkAvailability = async (payload) => {
  const { data } = await api.post("/auth/check-availability", payload);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};
