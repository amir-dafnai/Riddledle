import React, { useState, useEffect } from "react";
import "./EndOfGame.css";
import { getGlobalStats, getProgress, getUserStats } from "./localStorageUtils";
import { GAMESTATUS } from "./Consts";
import { RecordBreakView } from "./RecordsBreak";
import { StatsContainer } from "./StatsContainer";
import { WhatsAppShareButton } from "./SocialIcons";

const getFixedPercentage = (numerator, denomeneator) => {
  const percentage = (numerator / denomeneator) * 100;
  const fixedPercentage = percentage.toFixed(0);
  return fixedPercentage;
};

const isNumeric = (str) => {
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

const getHMSFormat = (timeInSeconds_) => {
  if (!isNumeric(timeInSeconds_)) return "00:00";

  const timeInSeconds = Math.round(timeInSeconds_);
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  const formattedTime =
    hours > 0
      ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(2, "0")}`
      : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;
  return formattedTime;
};

const getTimeToSolve = (start, end) => {
  const diffInSeconds = Math.round((end - start) / 1000);
  const formattedTime = getHMSFormat(diffInSeconds);
  return formattedTime;
};

const Top = ({ word, riddle, gameStatus }) => {
  const text = gameStatus === GAMESTATUS.win ? "הצלחת!" : "לא נורא...";
  const timeToSolve = getTimeToSolve(riddle.startTime, riddle.endTime);
  return (
    <>
      {" "}
      {/* Header Section */}
      <h2 className="win-message" dir="rtl">
        {text}
      </h2>
      <div className="word-display">
        {word.map((letter, index) => (
          <div
            key={index}
            className={`letter-tile ${letter !== " " ? "green-tile" : ""}`}
          >
            {letter}
          </div>
        ))}
      </div>
      {/* Time to Solve */}
      <div className="stat-large"> {timeToSolve} </div>
      <div className="stat-label"> זמן פתרון </div>
    </>
  );
};

const PersonalStats = () => {
  const personalStats = getUserStats();
  const winPercentage = getFixedPercentage(
    personalStats.wins,
    personalStats.total
  );
  const statsInfo = {
    title: "המשחקים שלך",
    leftLabel: "הזמן הקצר ביותר שלך",
    leftVal: getHMSFormat(personalStats.best_time),
    rightLabel: `${personalStats.wins} / ${personalStats.total} הצלחות`,
    rightVal: `${winPercentage}%`,
  };

  return <StatsContainer statsInfo={statsInfo} />;
};

const GlobalStats = () => {
  const globalStats = getGlobalStats();

  const globalWinPercentage = getFixedPercentage(
    globalStats.total_wins,
    globalStats.total_plays
  );
  const statsInfo = {
    title: "היום",
    leftLabel: `הזמן הקצר ביותר 
              ${globalStats.user_name}`,
    leftVal: getHMSFormat(globalStats.best_time),
    rightLabel: `${globalStats.total_wins} / ${globalStats.total_plays} הצליחו`,
    rightVal: `${globalWinPercentage}%`,
  };
  return <StatsContainer statsInfo={statsInfo} />;
};

const Timer = (onTimeEnds) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (time.hours === 0 && time.minutes === 0 && time.seconds === 0)
        onTimeEnds();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeEnds]);

  function calculateTimeLeft() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 1, 0, 0);
    const difference = midnight - now;

    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return (
    <>
      <h3 className="time">
        {`           החידה הבאה בעוד ${timeLeft.hours
          .toString()
          .padStart(2, "0")}:${timeLeft.minutes
          .toString()
          .padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}
          `}
      </h3>
    </>
  );
};

const Stats = () => {
  return (
    <>
      <GlobalStats />
      <PersonalStats />
    </>
  );
};

const GuestUserMessage = ({ login }) => {
  return (
    <div className="guest-user-message">
      <h3> ...אם היית מחובר היו כאן סטטיסטיקות</h3>
      <span className="login-link" onClick={login}>
        להתחברות
      </span>
    </div>
  );
};

const getWhatsAppMessage = (isLoggedIn, gameStatus) => {
  const recordBreak = getProgress().recordBreak;
  if (!isLoggedIn || gameStatus !== GAMESTATUS.win) return null;
  if (!recordBreak || !recordBreak.global)
    return "אני כבר פתרתי את החידה היומית 🏆 בוא נראה אותך";
  return "שברתי את השיא היומי! 🥇 בוא נראה אותך";
};

const EndOfGameForm = ({
  onTimeEnds,
  onClose,
  riddle,
  isLoggedIn,
  gameStatus,
  login,
}) => {
  return (
    <div className="timer-modal-overlay unselectable">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        {gameStatus === GAMESTATUS.win && isLoggedIn && (
          <RecordBreakView riddle={riddle} />
        )}
        <Top word={riddle.solution} riddle={riddle} gameStatus={gameStatus} />
        {isLoggedIn ? <Stats /> : <GuestUserMessage login={login} />}
        <WhatsAppShareButton
          message={getWhatsAppMessage(isLoggedIn, gameStatus)}
        />
        <Timer onTimeEnds={onTimeEnds} />
      </div>
    </div>
  );
};

export default EndOfGameForm;
