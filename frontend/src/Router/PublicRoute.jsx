// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = sessionStorage.getItem("accessToken");
  const userStr = sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (token && user) {
    // بر اساس نقش به داشبورد مناسب هدایت کن
    if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    } else if (user.role === "secretary") {
      return <Navigate to="/reception/dashboard" replace />;
    }
    // اگر نقش ناشناس بود، بره به لاگین
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PublicRoute;