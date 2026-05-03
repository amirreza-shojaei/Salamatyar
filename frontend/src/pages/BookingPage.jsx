// src/pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaArrowLeft } from "react-icons/fa";
import "../styles/BookingPage.css";
import api from "../api/axios";
import FooterLayout from "../Layout/FooterLayout";
import BookingModal from "../Modals/BookingModal";

function BookingPage() {
  const [doctors, setDoctors] = useState([]); // ← خالی
  const [loading, setLoading] = useState(true); // ← جدید
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/doctors_list/"); // ← اسلش اول;
      setDoctors(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div className="booking-header-content">
          <Link to="/" className="back-home-btn">
            <FaArrowLeft /> بازگشت به صفحه اصلی
          </Link>
          <h1 className="booking-header-title">
            <FaUserMd /> انتخاب پزشک
          </h1>
          <div className="placeholder"></div>
        </div>
      </header>

      <section className="doctors-section">
        <div className="container">
          <h2 className="section-title">لیست پزشکان متخصص</h2>
          
          {loading ? (
            <p style={{ textAlign: 'center' }}>در حال بارگذاری...</p>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div className="doctor-card" key={doctor.id}>
                  <img
                    src={doctor.picture}
                    alt={`${doctor.name} ${doctor.lastName}`}
                    className="doctor-img"
                  />
                  <h3 className="doctor-name">
                    {doctor.name} {doctor.lastName}
                  </h3>
                  <p className="doctor-specialty">{doctor.specialty}</p>
                  <button
                    className="appointment-btn"
                    onClick={() => openModal(doctor)}
                  >
                    ثبت نوبت
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onRequestClose={() => setIsBookingOpen(false)}
          doctorInfo={selectedDoctor}
        />
      )}
      <FooterLayout />
    </div>
  );
}

export default BookingPage;