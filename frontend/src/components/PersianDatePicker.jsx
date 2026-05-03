// src/components/PersianDatePicker.jsx
import React, { useState } from "react";

const PersianDatePicker = ({ value, onChange, placeholder = "انتخاب تاریخ" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // تبدیل به سال شمسی تقریبی
  const persianYear = currentYear - 621;
  
  const [year, setYear] = useState(persianYear);
  const [month, setMonth] = useState(1);
  
  const daysInMonth = (year, month) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    // اسفند
    return (year % 4 === 3) ? 30 : 29;
  };
  
  const handleSelect = (day) => {
    const formattedDate = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };
  
  return (
    <div className="persian-date-picker">
      <input
        type="text"
        value={value}
        onClick={() => setIsOpen(!isOpen)}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly
      />
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="picker-header">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[persianYear - 1, persianYear, persianYear + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          
          <div className="picker-days-header">
            {["ش", "ی", "د", "س", "چ", "پ", "ج"].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
          
          <div className="picker-days-grid">
            {Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                className="picker-day-btn"
                onClick={() => handleSelect(day)}
              >
                {day}
              </button>
            ))}
          </div>
          
          <button className="picker-close-btn" onClick={() => setIsOpen(false)}>
            بستن
          </button>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;