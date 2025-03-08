import "./EndOfGame.css";
import { GAMESTATUS } from "../Consts";
import { RecordBreakView } from "../RecordsBreak";
import { getWhatsAppMessage, WhatsAppShareButton } from "../SocialIcons";
import Leaderboard from "../Leaderboard";
import { Timer } from "./Timer";
import { Top } from "./FromTopSection";



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
