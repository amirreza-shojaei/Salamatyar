/**
 * تبدیل رشته زمان به دقیقه از نیمه‌شب
 * @param {string} timeStr - فرمت‌های مجاز: "9.15", "10.30", "11", "11.00"
 * @returns {number} دقیقه
 */
export const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hour, minute] = timeStr.split(':').map(Number);
  return hour * 60 + minute;  // این درسته! 8*60+30 = 480+30 = 510
};

/**
 * تولید تمام اسلات‌های ۱۵ دقیقه‌ای بین startHour و endHour (نیمه‌باز)
 * @param {number} startHour - ساعت شروع (مثلاً 8)
 * @param {number} endHour - ساعت پایان (مثلاً 12) - اسلات‌ها تا endHour-1:45 تولید می‌شوند
 * @returns {number[]} آرایه‌ای از دقیقه‌ها
 */
export const generateAllSlots = (startHour, endHour) => {
  const slots = [];
  const startMin = startHour * 60;
  const endMin = endHour * 60;
  for (let min = startMin; min < endMin; min += 15) {
    slots.push(min);
  }
  return slots;
};

/**
 * تبدیل دقیقه به رشته نمایشی "HH:MM"
 * @param {number} minutes
 * @returns {string}
 */
export const minutesToTimeString = (minutes) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour}:${minute.toString().padStart(2, '0')}`;
};

export const toEnglishDigits = (str) => {
      if (!str) return str;
      const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
      const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

      for (let i = 0; i < 10; i++) {
        str = str.replace(new RegExp(persianDigits[i], "g"), englishDigits[i]);
      }
      return str;
    };