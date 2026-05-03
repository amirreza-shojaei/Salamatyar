// src/pages/HomePage.jsx
import React from "react";
import { Link,  } from "react-router-dom";
import { FaUser,  } from "react-icons/fa";
import "../styles/HomePage.css";
import FooterLayout from "../Layout/FooterLayout";
import Carousel from "../components/Carousel";
import Services from "../components/servicesSection";
import Specialties from "../components/SpecialtiesSection";

function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <h1 className="logo">سلامت یار</h1>
        <img src="/media/logo/LogoName.png" alt="Logo" className="logo-img" />
        <nav className="home-nav">
            <div className="home-nav-item-Link">
              <Link to="/login">ورود 
                <FaUser />
              </Link>
            </div>
        </nav>
      </header>

      {/* بقیه کد بدون تغییر */}
      <main className="home-main">
        {/* Carousel Placeholder */}
        <Carousel
          autoPlayInterval={3000}
          showArrows={true}
          showDots={true}
        />

        {/* Section 1: خدمات */}
        <section className="services-section">
          <h2>خدمات ما</h2>
          <Services/>
        </section>

        {/* تخصص دکتر های کلینیک */}
        <section className="specialties-section">
          <h2>تخصص دکتر های ما</h2>
          <div className="specialties-box">
           <Specialties/>
          </div>
        </section>

        {/* Section 2: About Clinic */}
        <section className="about-section">
          <h2>درباره کلینیک</h2>
          <p>
            کلینیک ما با تیمی حرفه‌ای و تجهیزات مدرن، آماده ارائه بهترین خدمات
            درمانی به شما عزیزان است. هدف ما ایجاد تجربه‌ای راحت و مطمئن در حوزه
            سلامت می‌باشد.
          </p>
        </section>
      </main>

      {/* Footer */}
      <FooterLayout />
    </div>
  );
}

export default Home;