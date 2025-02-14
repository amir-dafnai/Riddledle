import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./SocialIcons.css";
import { GAMESTATUS } from "./Consts";
import { getProgress } from "./localStorageUtils";

const url = "https://riddledle.com";

export const getWhatsAppMessage = (isLoggedIn, gameStatus) => {
  const recordBreak = getProgress().recordBreak;
  if (!isLoggedIn || gameStatus !== GAMESTATUS.win)
    return "🔥 מצאתי משחק בדיוק בשבילך! ";
  if (recordBreak && recordBreak.global)
    return "שברתי את השיא היומי! 🥇 בוא נראה אותך";
  return "אני כבר פתרתי את החידה היומית 🏆 בוא נראה אותך";
};

export const WhatsAppShareButton = ({ message }) => {
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    message + " " + url
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

export const SocialIcons = ({ watsAppMessage }) => {
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
      <WhatsAppShareButton message={watsAppMessage} />
    </div>
  );
};

