import "./EndOfGame.css";
import { RecordBreakView } from "../RecordsBreak";
import { getWhatsAppMessage, WhatsAppShareButton } from "../SocialIcons";
import Leaderboard from "../Leaderboard";
import { Timer } from "./Timer";
import { Top } from "./FromTopSection";
import { isSingleRiddle } from "../RiddlesGroupUtils";




const EndOfGameForm = ({ onClose, riddle, userDetails , riddleGroup , isWinner, allStats }) => {
  const isLoggedIn= userDetails.loggedIn
  const showRecordBreak = riddleGroup.group.length === 1 && isLoggedIn && isWinner && userDetails.email !== riddle.credit_email
  const isMultiRiddle= !isSingleRiddle(riddleGroup)
  return allStats.leaderBoardStats && (
    <div className="timer-modal-overlay unselectable ">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        {showRecordBreak && (
          <RecordBreakView riddle={riddle} allStats={allStats} />
        )}
        <Top word={riddle.solution} isWinner={isWinner} isMultiRiddle={isMultiRiddle}/>
        <Leaderboard leaderBoardStats={allStats.leaderBoardStats} isMultiRiddle={isMultiRiddle}/>
        <WhatsAppShareButton
          message={getWhatsAppMessage(isLoggedIn, isWinner)}
        />
        <Timer />
      </div>
    </div>
  );
};

export default EndOfGameForm;
