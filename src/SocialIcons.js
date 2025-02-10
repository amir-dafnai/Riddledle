import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp} from "react-icons/fa";
import "./SocialIcons.css"; 

const url = "https://riddledle.com"


export const WhatsAppShareButton = ({ message }) => {
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
    message + " " + url
  )}`;
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp className="icon" />
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
      <a
        href="https://www.instagram.com/riddldle/"

        className="icon"
      >
        <FaInstagram />
      </a>
     <WhatsAppShareButton message={"🔥 מצאתי משחק בדיוק בשבילך! "}/>
    </div>
  );
};

export default SocialIcons;





