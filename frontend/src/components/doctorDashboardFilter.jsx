import React from "react";
import {  FaCalendarAlt} from "react-icons/fa";
function Filter ({activeFilter,dates,onSetActiveFilter}){

    return(
        <div className="date-filter-section">
                  <h3>
                    <FaCalendarAlt /> فیلتر بر اساس تاریخ
                  </h3>
                  <div className="date-filter-buttons">
                    <button 
                      className={activeFilter === "today" ? "active" : ""} 
                      onClick={() => onSetActiveFilter("today")}
                    >
                      امروز ({dates.today})
                    </button>
                    <button 
                      className={activeFilter === "tomorrow" ? "active" : ""} 
                      onClick={() => onSetActiveFilter("tomorrow")}
                    >
                      فردا ({dates.tomorrow})
                    </button>
                    <button 
                      className={activeFilter === "afterTomorrow" ? "active" : ""} 
                      onClick={() => onSetActiveFilter("afterTomorrow")}
                    >
                      پس‌فردا ({dates.afterTomorrow})
                    </button>
                    <button 
                      className={activeFilter === "all" ? "active" : ""} 
                      onClick={() => onSetActiveFilter("all")}
                    >
                      همه نوبت‌ها
                    </button>
                    
                  </div>
                </div>
        
    );
};

export default Filter;
