import React, { useState, useEffect } from "react";
import "./EndOfGame.css";
import { getGlobalStats, getUserStats } from "./localStorageUtils";
import { GAMESTATUS } from "./Consts";
import { RecordBreakView } from "./RecordsBreak";
import { StatsContainer } from "./StatsContainer";
import { getWhatsAppMessage, WhatsAppShareButton } from "./SocialIcons";
import { getHMSFormat, getTimeToSolveSeconds } from "./appUtils";

const getFixedPercentage = (numerator, denomeneator) => {
  if (!numerator || !denomeneator) return 0;
  const percentage = denomeneator === 0 ? 0 : (numerator / denomeneator) * 100;
  const fixedPercentage = percentage.toFixed(0);
  return fixedPercentage;
};

const getTimeToSolveText = (riddle) => {
  const diffInSeconds = getTimeToSolveSeconds(riddle);
  const formattedTime = getHMSFormat(diffInSeconds);
  return formattedTime;
};

const Top = ({ word, riddle, gameStatus }) => {
  const text = gameStatus === GAMESTATUS.win ? "הצלחת!" : "לא נורא...";
  const timeToSolve = getTimeToSolveText(riddle);
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
            className={`${letter !== " " ?  "letter-tile" : "invisible-tile"} ${letter !== " " ? "green-tile" : ""}`}
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
  const defaultStats = { best_time: null, wins: 0, total: 0 };
  const personalStats = getUserStats() || defaultStats;
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
  const defaultStats = {
    total_wins: 0,
    total_plays: 0,
    user_name: null,
    best_time: null,
  };
  const globalStats = getGlobalStats() || defaultStats;
  const globalWinPercentage = getFixedPercentage(
    globalStats && globalStats.total_wins,
    globalStats && globalStats.total_plays
  );
  const statsInfo = {
    title: "היום",
    leftLabel: `הזמן הקצר ביותר 
              ${globalStats.user_name || ""}`,
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
      <h3> ... אם היית מחובר היו כאן את הסטטיסטיקות שלך</h3>
      <span className="login-link" onClick={login}>
        להתחברות
      </span>
    </div>
  );
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
