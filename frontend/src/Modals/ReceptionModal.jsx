// src/Modals/PatientInfoModal.jsx
import React from "react";
import Modal from "react-modal";
import "../styles/PatientInfoModal.css";

function PatientInfoModal({ isOpen, onClose, appointment, onAction }) {
  const [isLoading, setIsLoading] = React.useState(false);

  if (!appointment) return null;

  const handleAction = async (action) => {
    setIsLoading(true);
    try {
      // صدا زدن تابع والد با نوع اکشن
      await onAction({
        id: appointment.id,
        status: action, // "accept" یا "reject"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="patient-info-modal"
      overlayClassName="patient-info-overlay"
      ariaHideApp={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>اطلاعات بیمار</h2>
          <button onClick={onClose} className="close-modal-btn">×</button>
        </div>

        <div className="modal-body">
          <div className="patient-info-list">
            <div className="info-item">
              <div className="info-label name">نام</div>
              <div className="info-value">{appointment.patient_first_name}</div>
            </div>

            <div className="info-item">
              <div className="info-label lastname">نام خانوادگی</div>
              <div className="info-value">{appointment.patient_last_name}</div>
            </div>

            <div className="info-item">
              <div className="info-label phone">شماره تماس</div>
              <div className="info-value">{appointment.patient_phone}</div>
            </div>

            <div className="info-item">
              <div className="info-label national">کد ملی</div>
              <div className="info-value">{appointment.patient_national_code}</div>
            </div>

            <div className="info-item">
              <div className="info-label problem">مشکل</div>
              <div className="info-value">{appointment.problem || "بدون شرح"}</div>
            </div>
          </div>
        </div>

        {/* دکمه‌های اقدام - در فوتر جداگانه */}
        <div className="modal-actions">
          <button
            className="action-btn reject-btn"
            onClick={() => handleAction("reject")}
            disabled={isLoading}
          >
            {isLoading ? "..." : "❌ لغو نوبت"}
          </button>
          <button
            className="action-btn approve-btn"
            onClick={() => handleAction("accept")}
            disabled={isLoading}
          >
            {isLoading ? "..." : "✅ تایید نوبت"}
          </button>
          <button onClick={onClose} className="close-action-btn">
            بستن
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PatientInfoModal;