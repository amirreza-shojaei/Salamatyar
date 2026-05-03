// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaTelegram, FaLinkedin, FaHeart } from "react-icons/fa";
import footerData from "../siteData/footer/data.json";
import "../styles/Footer.css";

// نگاشت اسم آیکون به کامپوننت واقعی
const iconMap = {
  FaInstagram: FaInstagram,
  FaTelegram: FaTelegram,
  FaLinkedin: FaLinkedin,
  FaPhone: FaPhone,
  FaEnvelope: FaEnvelope,
  FaMapMarkerAlt: FaMapMarkerAlt,
  FaHeart: FaHeart,
};

function FooterLayout() {
  const currentYear = new Date().getFullYear();

  // تابع برای رندر آیکون مناسب
  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* ستون اول: لوگو و توضیحات */}
        <div className="footer-column">
          <h3 className="footer-logo">{footerData.logo}</h3>
          <p className="footer-description">{footerData.description}</p>
          <div className="footer-social">
            {footerData.socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
              >
                {renderIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>

        {/* ستون دوم: لینک‌های سریع */}
        <div className="footer-column">
          <h4>لینک‌های سریع</h4>
          <ul className="footer-links">
            {footerData.quickLinks.map((link, index) => (
              <li key={index}>
                {link.type === "internal" ? (
                  <Link to={link.path}>{link.name}</Link>
                ) : (
                  <a href={link.path}>{link.name}</a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ستون سوم: اطلاعات تماس */}
        <div className="footer-column">
          <h4>تماس با ما</h4>
          <ul className="footer-contact">
            <li>
              <FaPhone /> <span>{footerData.contactInfo.phone}</span>
            </li>
            <li>
              <FaEnvelope /> <span>{footerData.contactInfo.email}</span>
            </li>
            <li>
              <FaMapMarkerAlt /> <span>{footerData.contactInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="footer-bottom">
        <p>
          {footerData.copyright.text}
          <br className="mobile-break" />
          {footerData.copyright.heartText.replace("❤️", "")}
          <FaHeart className="footer-heart" /> و افتخار
        </p>
        <p className="copyright">© {currentYear} {footerData.logo}</p>
      </div>
    </footer>
  );
}

export default FooterLayout;