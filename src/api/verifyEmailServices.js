import api from "./api";
import Cookies from "js-cookie";

export const sendOtpVerifyEmail = async (email) => {
  const { data } = await api.post("/auth/verify/resend-code", { email });

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};

export const verifyEmail = async (payload) => {
  const { data } = await api.post("/auth/verify-account", payload);

  if (data?.data?.token) {
    Cookies.set("token", data?.data?.token);
  }

  return data?.data;
};
