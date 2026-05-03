// src/components/Carousel.jsx
import React, { useState, useEffect, useCallback } from "react";
import slideData from "../siteData/homePage/slider.json"
import "../styles/Carousel.css";

function Carousel({  autoPlayInterval = 3000, showArrows = true, showDots = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
const items = slideData;
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // اتوپلی هر ۳ ثانیه
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, goToNext]);

  // توقف خودکار در هنگام هاور (اختیاری)
  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  if (!items || items.length === 0) {
    return <div className="carousel-empty">محتوایی برای نمایش وجود ندارد</div>;
  }

  return (
    <div
      className="carousel-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* اسلایدها */}
      <div className="carousel-slides">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
            style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
          >
            <img src={item.src} alt={item.alt || `slide-${index}`} />
            {item.caption && <div className="carousel-caption">{item.caption}</div>}
          </div>
        ))}
      </div>

      
            {/* دکمه بعدی */}
            {showArrows && (
              <button className="carousel-arrow next" onClick={goToPrev}>
                &#10094;
              </button>
            )}
      {/* دکمه قبلی */}
      {showArrows && (
        <button className="carousel-arrow prev" onClick={goToNext}>
          &#10095;
        </button>
      )}

      {/* نقاط پایین */}
      {showDots && (
        <div className="carousel-dots">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;