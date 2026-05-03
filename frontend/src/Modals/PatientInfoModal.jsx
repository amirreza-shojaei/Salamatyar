import React from "react";
import Modal from "react-modal";
import "../styles/PatientInfoModal.css"

function PatientInfoModal({ isOpen, onClose, appointment }) {

  if (!appointment) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose}
      className="ReactModal__Content"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>اطلاعات بیمار</h2>
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
              <div className="info-value">{appointment.problem}</div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="close-button">
            بستن
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default PatientInfoModal;