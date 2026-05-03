// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Input from "../components/Input";
import "../styles/loginPage.css";
import api from "../api/axios";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError("لطفاً شماره تلفن و رمز عبور را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/accounts/api/v1/jwt/create/", {
        phone: phone,
        password: password,
        // role: role,
      });

      if (res.data.access) {
        // ← بدون data
        sessionStorage.setItem("accessToken", res.data.access);
        sessionStorage.setItem("refreshToken", res.data.refresh);
        const user = res.data.user;

       if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        
        // ریدایرکت بر اساس نقش
        if (user.role === "doctor") {
          navigate("/doctor/dashboard");
        } else if (user.role === "secretary") {
          navigate("/reception/dashboard");

        }else {
          setError("دسترسی شما به این بخش محدود شده است");
          sessionStorage.clear();
        }
      }
      } else {
        setError("پاسخ سرور معتبر نیست");
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.status === 401) {
        setError("شماره تلفن یا رمز عبور اشتباه است");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        if (typeof err.response.data.error === "object") {
          const errors = Object.values(err.response.data.error).flat();
          setError(errors.join(" - "));
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="back-home-btn">
            <FaArrowLeft /> بازگشت به صفحه اصلی
          </Link>
          <h2>ورود به سیستم سلامت‌یار</h2>
          <p>لطفاً اطلاعات کاربری خود را وارد نمایید</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleLogin}>
          <Input
            label="شماره تلفن"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 09123456789"
            required
            autoFocus
          />

          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور خود را وارد کنید"
            required
          />

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود به سیستم"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            فقط پزشکان می‌توانند وارد شوند
            <br />
            در صورت نداشتن حساب کاربری، با مدیر سیستم تماس بگیرید
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
