// src/Modals/BookingModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import Input from "../components/Input";
import Toast from "../components/Toast";
import BookingCalendar from "../components/BookingCalendar";
import { toEnglishDigits } from "../utils/funcForBookingCalendar";
import api from "../api/axios";
import "../styles/BookingModal.css";

function BookingModal({ isOpen, onRequestClose, doctorInfo }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingResult, setBookingResult] = useState({
    date: null,
    time: null,
  });

  // ریست فرم
  const resetForm = () => {
    setName("");
    setLastName("");
    setPhoneNumber("");
    setNationalCode("");
    setProblem("");
    setBookingResult({ date: null, time: null });
    setError("");
  };

  // بستن مودال با ریست
  const handleClose = () => {
    resetForm();
    onRequestClose();
  };

  // ثبت نوبت
  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    if (!bookingResult.date || !bookingResult.time) {
      setError("لطفاً تاریخ و زمان نوبت را انتخاب کنید");
      return;
    }

    if (!name || !lastName || !phoneNumber || !nationalCode) {
      setError("لطفاً تمام اطلاعات بیمار را وارد کنید");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const appointmentData = {
        doctor: doctorInfo.id,
        patient_first_name: name,
        patient_last_name: lastName,
        patient_phone: toEnglishDigits(phoneNumber),
        patient_national_code: toEnglishDigits(nationalCode),
        problem: problem || "بدون شرح",
        date: bookingResult.date,
        time: bookingResult.time,
      };

      const response = await api.post(
        "/appointments/api/v1/create/",
        appointmentData,
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess("نوبت شما با موفقیت ثبت شد");
      }
    } catch (err) {
      console.error("خطا در ثبت نوبت:", err);
      setError(
        err.response?.data?.message ||
          "خطا در ثبت نوبت، لطفاً دوباره تلاش کنید",
      );
    } finally {
      setLoading(false);
    }
  };

  // اگر doctorInfo موجود نباشه، مودال رو خالی نمایش نده
  if (!doctorInfo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="booking-modal"
      overlayClassName="booking-modal-overlay"
      ariaHideApp={false}
      style={{
    content: {
      borderRadius: '32px',
      overflow: 'auto',
      background: '#ffffff',
    },
   
  }}
    >
      <div className="modal-header">
        <h2>انتخاب نوبت برای</h2>
        <button onClick={handleClose} className="close-modal-btn">
          &times;
        </button>
      </div>

      {/* اطلاعات دکتر */}
      <div className="modal-doctor-info">
        <img
          src={doctorInfo.picture}
          alt={`${doctorInfo.name} ${doctorInfo.lastName}`}
        />
        <h3 className="doctor-name">
          {doctorInfo.name} {doctorInfo.lastName}
        </h3>
        <p className="doctor-specialty">{doctorInfo.specialty}</p>
      </div>

      <div className="modal-content">
        <form className="modal-form" onSubmit={handleSubmitAppointment}>
          <Input
            label="اسم بیمار"
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام بیمار را وارد کنید"
            required
          />
          <Input
            label="نام خانوادگی بیمار"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی بیمار را وارد کنید"
            required
          />
          <Input
            label="کد ملی بیمار"
            type="text"
            name="nationalCode"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            placeholder="کد ملی بیمار را وارد کنید"
            required
            pattern="\d{10}"
            title="کد ملی باید دقیقاً ۱۰ رقم باشد"
          />
          <Input
            label="شماره تماس"
            type="text"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="شماره تماس را وارد کنید"
            required
            pattern="09[0-9]{9}"
          />
          <Input
            label="مشکل یا بیماری"
            type="text"
            name="problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="وضعیت خود را شرح دهید..."
            
          />

          {/* تقویم */}
          <BookingCalendar
            workingTimes={doctorInfo.workingTimes}
            onSelectionComplete={(result) => {
              setBookingResult({
                date: result.date,
                time: result.time,
              });
            }}
          />

          {error && <div className="error-message">{error}</div>}
          {success && (
            <>
              {" "}
              <Toast
                message={"نوبت شما با موفقیت ثبت شد"}
                type={"success"}
                onClose={() => {
                  handleClose();
                }}
              />
            </>
          )}
          <button className="modal-submit-btn" type="submit" disabled={loading}>
            {loading ? "در حال ثبت..." : "تایید نوبت"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default BookingModal;
