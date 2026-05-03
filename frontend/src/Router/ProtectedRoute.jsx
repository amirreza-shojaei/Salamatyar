// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = sessionStorage.getItem("accessToken");
  const userStr = sessionStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // 1. چک کردن وجود توکن
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. اگر نقش مشخص شده، بررسی کن
  if (allowedRoles.length > 0) {
    if (!user || !allowedRoles.includes(user?.role)) {
      // نقش مجاز نیست → برو به صفحه لاگین یا صفحه خطا
      console.warn(`Role ${user?.role} not allowed. Allowed: ${allowedRoles}`);
      return <Navigate to="/login" replace />;
    }
  }

  // همه چیز درسته → نمایش محتوا
  return children;
}

export default ProtectedRoute;