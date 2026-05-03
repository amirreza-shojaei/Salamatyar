import jalaali from 'jalaali-js';
  // دریافت تاریخ شمسی امروز، فردا، پس‌فردا
 export const getJalaaliDates = () => {
    const today = new Date();
    const toJalaali = (date) => {
      const { jy, jm, jd } = jalaali.toJalaali(date);
      return `${jy}/${jm.toString().padStart(2, '0')}/${jd.toString().padStart(2, '0')}`;
    };
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const afterTomorrow = new Date(today);
    afterTomorrow.setDate(today.getDate() + 2);
    
    return {
      today: toJalaali(today),
      tomorrow: toJalaali(tomorrow),
      afterTomorrow: toJalaali(afterTomorrow),
    };
  };