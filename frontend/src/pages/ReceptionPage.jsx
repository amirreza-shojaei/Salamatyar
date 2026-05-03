// src/pages/ReceptionDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/ReceptionPage.css";
import DDHeader from "../Layout/doctorDashboardHeader";
import { getJalaaliDates } from "../utils/funcForDoctorDashboard";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import Filter from "../components/doctorDashboardFilter";
import AppointmentModal from "../Modals/ReceptionModal";
import toast from "react-hot-toast";
import PersianDatePicker from "../components/PersianDatePicker";  

function ReceptionDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("today");
  const [receptionName, setReceptionName] = useState("منشی");
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dates = getJalaaliDates();

  // State های بخش ثبت زمان
  const [scheduleDate, setScheduleDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    if (!appointments.length) {
      setFilteredAppointments([]);
      return;
    }
    if (activeFilter === "all") {
      setFilteredAppointments(appointments);
    } else if (activeFilter === "today") {
      setFilteredAppointments(appointments.filter((apt) => apt.date === dates.today));
    } else if (activeFilter === "tomorrow") {
      setFilteredAppointments(appointments.filter((apt) => apt.date === dates.tomorrow));
    } else if (activeFilter === "afterTomorrow") {
      setFilteredAppointments(appointments.filter((apt) => apt.date === dates.afterTomorrow));
    }
  }, [activeFilter, appointments, dates.today, dates.tomorrow, dates.afterTomorrow]);

  useEffect(() => {
    fetchReceptionInfo();
    fetchAppointments();
  }, []);

  const fetchReceptionInfo = () => {
    try {
      const userStr = sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setReceptionName(user.full_name || user.phone || "منشی");
      }
    } catch (err) {
      console.log("Error reading user:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reception/api/v1/pending-appointments/");
      setAppointments(res.data.data || res.data || []);
    } catch (err) {
      console.error("error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      const res = await api.post(`/reception/api/v1/pending-appointments/${appointmentId}/approve/`);
      if (res.data.status === "success") {
        toast.success("نوبت با موفقیت تایید شد");
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
        setIsOpen(false);
        setSelected(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در تایید نوبت");
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const res = await api.post(`/reception/api/v1/pending-appointments/${appointmentId}/reject/`);
      if (res.data.status === "success") {
        toast.success("نوبت رد شد");
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
        setIsOpen(false);
        setSelected(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در رد نوبت");
    }
  };

  // ثبت زمان کاری دکتر
  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (!scheduleDate || !startTime || !endTime) {
      toast.error("لطفاً تاریخ و ساعت شروع و پایان را وارد کنید");
      return;
    }

    try {
      setScheduleLoading(true);
      const res = await api.post("/reception/api/v1/schedules/create/", {
        date: scheduleDate,
        start_time: startTime,
        end_time: endTime,
      });

      if (res.data.status === "success") {
        toast.success(res.data.message);
        setScheduleDate("");
        setStartTime("");
        setEndTime("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "خطا در ثبت زمان کاری");
    } finally {
      setScheduleLoading(false);
    }
  };

  const openModal = (appointment) => {
    setSelected(appointment);
    setIsOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="secretary-container">
      <DDHeader doctorName={receptionName} onlogout={handleLogout} whos={"منشی"} />

      <main className="dashboard-main">
        {/* بخش ثبت زمان کاری دکتر */}
        <section className="schedule-section">
          <h2>
            <FaCalendarAlt /> ثبت زمان کاری دکتر
          </h2>
          <form onSubmit={handleCreateSchedule} className="schedule-form">
            <div className="schedule-form-row">
              <div className="schedule-input-group">
                <label>تاریخ</label>
                <PersianDatePicker
                  value={scheduleDate}
                  onChange={setScheduleDate}
                 placeholder="مثال: 1404/02/01"
                />
              </div>
              <div className="schedule-input-group">
                <label>ساعت شروع</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="schedule-input-group">
                <label>ساعت پایان</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="schedule-submit-btn" disabled={scheduleLoading}>
              {scheduleLoading ? "در حال ثبت..." : "ثبت برنامه"}
            </button>
          </form>
        </section>

        <Filter dates={dates} activeFilter={activeFilter} onSetActiveFilter={(e) => setActiveFilter(e)} />

        <div className="appointments-section">
          <div className="appointments-header">
            <h3><FaClock /> لیست درخواست‌های نوبت</h3>
            <span className="appointments-count">{filteredAppointments.length} نوبت</span>
          </div>

          {loading ? (
            <div className="loading-state">در حال بارگذاری...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-state"><p>هیچ نوبتی برای تاریخ انتخاب شده وجود ندارد</p></div>
          ) : (
            <div className="appointments-grid">
              {filteredAppointments.map((a) => (
                <div key={a.id} className="appointment-card" onClick={() => openModal(a)}>
                  <div className="appointment-info">
                    <h4 className="patient-name">{a.patient_first_name} {a.patient_last_name}</h4>
                    <p className="patient-doctors-info">
                      {a.doctorInfo?.name} {a.doctorInfo?.lastName} - {a.doctorInfo?.specialties}
                    </p>
                    <div className="appointment-details">
                      <span className="appointment-time"><FaClock /> {a.time}</span>
                      <span className="appointment-date"><FaCalendarAlt /> {a.date}</span>
                    </div>
                  </div>
                  <div className="appointment-status-badge">
                    <span className="status-pending">در انتظار تایید</span>
                  </div>
                  <div className="appointment-arrow">←</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isOpen && (
        <AppointmentModal
          isOpen={isOpen}
          onClose={() => { setIsOpen(false); setSelected(null); }}
          appointment={selected}
          onAction={async ({ id, status }) => {
            if (status === "accept") await handleApprove(id);
            else await handleReject(id);
          }}
        />
      )}
    </div>
  );
}

export default ReceptionDashboard;