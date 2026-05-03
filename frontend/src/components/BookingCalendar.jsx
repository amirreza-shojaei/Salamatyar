import React, { useState, useEffect, useMemo } from "react";
import {
  parseTimeToMinutes,
  generateAllSlots,
  minutesToTimeString,
} from "../utils/funcForBookingCalendar";
import "../styles/BookingCalendar.css";

function BookingCalendar({ workingTimes = [], onSelectionComplete }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime,setSelectedTime]=useState(null);
  // تنظیم اولین تاریخ به عنوان انتخاب پیش‌فرض در صورت تغییر workingTimes
  useEffect(() => {
    if (workingTimes.length > 0 && !selectedDate) {
      setSelectedDate(workingTimes[0].date);
    }
  }, [workingTimes, selectedDate]);

  // اطلاعات روز جاری انتخاب شده
  const currentDayData = useMemo(() => {
    if (!selectedDate) return null;
    return workingTimes.find((item) => item.date === selectedDate);
  }, [workingTimes, selectedDate]);

  // لیست اسلات‌های قابل رزرو برای روز انتخاب شده
const availableSlots = useMemo(() => {
  if (!currentDayData) return [];

  const { startTime, finishTime, fullTime = [] } = currentDayData;
  
  const allSlotMinutes = generateAllSlots(startTime, finishTime, 30);
  
  const bookedMinutes = fullTime.map(time => {
    const minutes = parseTimeToMinutes(time);
    return minutes;
  });
  
  const freeSlots = allSlotMinutes.filter(
    (slotMin) => !bookedMinutes.includes(slotMin)
  );
  
  return freeSlots.map((minutes) => ({
    minutes,
    displayTime: minutesToTimeString(minutes),
  }));
}, [currentDayData]);

  const handleSlotClick = (slot) => {
    setSelectedTime(slot);
    if (onSelectionComplete && selectedDate) {
      onSelectionComplete({
        date: selectedDate,
        time: slot.displayTime
      });
    }
  };

  if (!workingTimes.length) {
    return (
      <div className="booking-calendar-empty">
        اطلاعاتی برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <div className="booking-calendar">
      {/* نوار انتخاب تاریخ */}
      <div className="calendar-dates">
        {workingTimes.map((day) => (
          <button
            key={day.date}
            className={`date-btn ${selectedDate === day.date ? "active" : ""}`}
            onClick={() => setSelectedDate(day.date)}
          >
            {day.date}
          </button>
        ))}
      </div>

      {/* نمایش اسلات‌های روز انتخاب شده */}
      <div className="calendar-slots">
        {!selectedDate && <p>لطفاً یک تاریخ انتخاب کنید</p>}
        {selectedDate && availableSlots.length === 0 && (
          <p className="no-slots">هیچ نوبت آزادی برای این روز وجود ندارد</p>
        )}
        {availableSlots.length > 0 && (
          <>
            <h4 className="slots-title">
              نوبت‌های قابل رزرو برای {selectedDate}
            </h4>
            <div className="slots-grid">
              {availableSlots.map((slot) => (
                <button
                  key={slot.minutes}
                  className={` slot-btn ${slot === selectedTime ? "active" :""}`}
                   type="button" 
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.displayTime}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingCalendar;
