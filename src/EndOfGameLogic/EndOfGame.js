import "./EndOfGame.css";
import { GAMESTATUS } from "../Consts";
import { RecordBreakView } from "../RecordsBreak";
import { getWhatsAppMessage, WhatsAppShareButton } from "../SocialIcons";
import Leaderboard from "../Leaderboard";
import { Timer } from "./Timer";
import { Top } from "./FromTopSection";



const EndOfGameForm = ({ onClose, riddle, userDetails, gameStatus, login }) => {
  const isLoggedIn= userDetails.loggedIn
  const showRecordBreak = isLoggedIn && gameStatus === GAMESTATUS.win && userDetails.email !== riddle.credit_email
  return (
    <div className="timer-modal-overlay unselectable">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        {showRecordBreak && (
          <RecordBreakView riddle={riddle} />
        )}
        <Top word={riddle.solution} gameStatus={gameStatus} />
        <Leaderboard riddle={riddle} login={login}/>
        <WhatsAppShareButton
          message={getWhatsAppMessage(isLoggedIn, gameStatus)}
        />
        <Timer />
      </div>
    </div>
  );
};

export default EndOfGameForm;
