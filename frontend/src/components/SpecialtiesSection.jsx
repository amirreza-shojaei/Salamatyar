// src/components/Specialties.jsx
import React, { useRef } from "react";
import specialtiesData from "../siteData/homePage/specialties.json";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";


function Specialties() {
  const scrollContainerRef = useRef(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="specialties-wrapper">
      <div className="specialties-header">
      </div>

      <div className="specialties-carousel-container">
        <button className="carousel-btn left-btn" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>

        <div className="specialties-scroll-container" ref={scrollContainerRef}>
          {specialtiesData.map((item, index) => (
            <div className="specialty-card" key={index}>
              <img src={item.img} alt={item.title} className="specialty-img" />
              <h3 className="specialty-title">{item.title}</h3>
            </div>
          ))}
        </div>

        <button className="carousel-btn right-btn" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Specialties;