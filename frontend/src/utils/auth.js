// src/utils/auth.js
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};