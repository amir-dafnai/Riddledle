import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./SocialIcons.css";

const url = "https://riddledle.com";

export const WhatsAppShareButton = ({ message }) => {
  const messageToUse = message || "🔥 מצאתי משחק בדיוק בשבילך! ";
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    messageToUse + " " + url
  )}`;
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="icon"
    >
      <FaWhatsapp />
    </a>
  );
};

const SocialIcons = () => {
  return (
    <div className="social-icons">
      <a
        href="https://www.facebook.com/profile.php?id=61572805843457"
        className="icon"
      >
        <FaFacebook />
      </a>
      <a href="https://www.instagram.com/riddldle/" className="icon">
        <FaInstagram />
      </a>
      <WhatsAppShareButton />
    </div>
  );
};

export default SocialIcons;
