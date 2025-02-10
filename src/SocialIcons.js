import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "./SocialIcons.css"; // Import the CSS file

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a
        href="https://www.facebook.com/profile.php?id=61572805843457"
        className="icon facebook"
      >
        <FaFacebook />
      </a>
      <a
        href="https://www.instagram.com/riddldle/"

        className="icon instagram"
      >
        <FaInstagram />
      </a>
    </div>
  );
};

export default SocialIcons;
