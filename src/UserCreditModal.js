import { WhatsAppShareButton } from "./SocialIcons";
import "./UserCreditModal.css";
export const CreditModal = ({ onClose }) => {
  return (
    <div className="credit-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 dir="rtl"> איזה כיף! 🎉</h2>
        <p>
          החידה של היום היא חידה שלך! קדימה להשוויץ לחברים!
        </p>
        <h4>לשיתוף בוואטסאפ</h4>
        <WhatsAppShareButton message={"בואו לפתור חידה שאני כתבתי!"} />
      </div>
    </div>
  );
};
