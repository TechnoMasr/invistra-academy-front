import api from "./api";
import Cookies from "js-cookie";

export const sendOtp = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const resendOtp = async (email) => {
  const { data } = await api.post("/auth/resend-code", { email });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const verifyOtp = async (payload) => {
  const { data } = await api.post("/auth/verify-reset-code", payload);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};
