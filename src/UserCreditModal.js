import { WhatsAppShareButton } from "./SocialIcons";
import "./UserCreditModal.css";
export const CreditModal = ({ setShowModal }) => {
  return (
    <div className="credit-modal">
      <div className="modal-content">
        <button className="close-button" onClick={() => setShowModal(false)}>
          ×
        </button>
        <h2 dir="rtl"> איזה כיף! 🎉</h2>
        <p>
          החידה של היום חידה שאתה יצרת! אמנם לא תוכל להתחרות אבל בוא נראה מה
          חברים שלך חושבים עליה!
        </p>
        <h4>לשיתוף בוואטסאפ</h4>
        <WhatsAppShareButton message={"בואו לפתור חידה שאני כתבתי!"} />
      </div>
    </div>
  );
};
