import React from "react";
import { FaSignOutAlt, FaUserMd } from "react-icons/fa";

function DDHeader ({onlogout,doctorName,whos}){

    return(
        <header className="dashboard-header">
                <div className="header-content">
                  <div className="header-title">
                    <FaUserMd className="header-icon" />
                    <h1>داشبورد {whos || "شما"}</h1>
                  </div>
                  <div className="header-info">
                    <span className="doctor-welcome">خوش آمدید {doctorName || "عزیز"}</span>
                    <button onClick={onlogout} className="logout-btn">
                      <FaSignOutAlt /> خروج
                    </button>
                  </div>
                </div>
              </header>
    );
}

export default DDHeader;