import "./EndOfGame.css";
import { GAMESTATUS } from "../Consts";
import { RecordBreakView } from "../RecordsBreak";
import { getWhatsAppMessage, WhatsAppShareButton } from "../SocialIcons";
import Leaderboard from "../Leaderboard";
import { Timer } from "./Timer";
import { Top } from "./FromTopSection";

const GuestUserMessage = ({ login }) => {
  return (
    <div className="guest-user-message">
      <h3> ... אם היית מחובר היו כאן את הסטטיסטיקות שלך</h3>
      <span className="login-link" onClick={login}>
        להתחברות
      </span>
    </div>
  );
};

const EndOfGameForm = ({ onClose, riddle, isLoggedIn, gameStatus, login }) => {
  return (
    <div className="timer-modal-overlay unselectable">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        {gameStatus === GAMESTATUS.win && isLoggedIn && (
          <RecordBreakView riddle={riddle} />
        )}
        <Top word={riddle.solution} gameStatus={gameStatus} />
        {isLoggedIn ? <Leaderboard riddle={riddle}/> : <GuestUserMessage login={login} />}
        <WhatsAppShareButton
          message={getWhatsAppMessage(isLoggedIn, gameStatus)}
        />
        <Timer />
      </div>
    </div>
  );
};

export default EndOfGameForm;
