import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/", // بک‌اند بعدا تنظیم میکنه
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // توکن منقضی شده یا نامعتبر است، کاربر را به صفحه ورود هدایت کن
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      alert("لطفا دوباره وارد شوید");
      window.location.href = "/login";
    }
    if (error.response && error.response.status === 403) {
      // کاربر دسترسی لازم را ندارد، به صفحه ورود هدایت کن
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error.response || error);
  });

export default api;