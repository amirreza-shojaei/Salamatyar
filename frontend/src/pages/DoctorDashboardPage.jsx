// src/pages/DoctorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Filter from "../components/doctorDashboardFilter";
import api from "../api/axios";
import PatientInfoModal from "../Modals/PatientInfoModal";
import "../styles/DoctorDashboardPage.css";
import { getJalaaliDates } from '../utils/funcForDoctorDashboard';
import DDHeader from "../Layout/doctorDashboardHeader";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("today");
  const [doctorName, setDoctorName] = useState("");
  const navigate = useNavigate();
  const dates =getJalaaliDates();
  // فیلتر کردن بر اساس تاریخ انتخاب شده
  useEffect(() => {
    if (!appointments.length) {
      setFilteredAppointments([]);
      return;
    }
    if (activeFilter === "all") {
      setFilteredAppointments(appointments);
    } else if (activeFilter === "today") {
      setFilteredAppointments(appointments.filter(apt => apt.date === dates.today));
    } else if (activeFilter === "tomorrow") {
      setFilteredAppointments(appointments.filter(apt => apt.date === dates.tomorrow));
    } else if (activeFilter === "afterTomorrow") {
      setFilteredAppointments(appointments.filter(apt => apt.date === dates.afterTomorrow));
    }
  }, [activeFilter, appointments, dates.today, dates.tomorrow, dates.afterTomorrow]);

  useEffect(() => {
    fetchApprovedAppointments();
    fetchDoctorInfo();
  }, []);

  const fetchApprovedAppointments = async () => {
    try {
      const res = await api.get("api/v1/doctor_dashbord/");
       setAppointments(res.data.data);
    } catch (err) {
      console.log(err.status, err.data);
    }
  };

  const fetchDoctorInfo = () => {
  try {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // user.full_name رو موقع لاگین ذخیره کردی
      setDoctorName(user.full_name || "دکتر");
    } else {
      setDoctorName("دکتر");
    }
  } catch (err) {
    console.log("Error reading user from localStorage:", err);
    setDoctorName("دکتر");
  }
};

  const openModal = (appointment) => {
    setSelected(appointment);
    setIsOpen(true);
  };

  const handleLogout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="doctor-dashboard">
      {/* هدر داشبورد */}
      <DDHeader doctorName={doctorName} onlogout={handleLogout}/>

      <main className="dashboard-main">
        {/* دکمه‌های فیلتر تاریخ */}
        <Filter dates={dates} activeFilter={activeFilter} onSetActiveFilter={(e)=>setActiveFilter(e)} />

        {/* لیست نوبت‌ها */}
        <div className="appointments-section">
          <div className="appointments-header">
            <h3>
              <FaClock /> لیست نوبت‌ها
            </h3>
            <span className="appointments-count">
              {filteredAppointments.length} نوبت
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <p>هیچ نوبتی برای تاریخ انتخاب شده وجود ندارد</p>
            </div>
          ) : (
            <div className="appointments-grid">
              {filteredAppointments.map((a) => (
                <div
                  key={a.id}
                  className="appointment-card"
                  onClick={() => openModal(a)}
                >
                  <div className="appointment-info">
                    <h4 className="patient-name">
                      {a.patient_first_name} {a.patient_last_name}
                    </h4>
                    <div className="appointment-details">
                      <span className="appointment-time">
                        <FaClock /> {a.time}
                      </span>
                      <span className="appointment-date">
                        <FaCalendarAlt /> {a.date}
                      </span>
                    </div>
                  </div>
                  <div className="appointment-arrow">←</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* مودال اطلاعات بیمار */}
      {isOpen && (
        <PatientInfoModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          appointment={selected}
        />
      )}
    </div>
  );
}

export default DoctorDashboard;