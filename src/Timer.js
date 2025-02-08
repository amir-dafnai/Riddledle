import React, { useState, useEffect } from "react";
import "./Timer.css";
import { getGlobalStats, getUserStats } from "./localStorageUtils";
import { GAMESTATUS } from "./Consts";

const getFixedPercentage = (numerator, denomeneator) => {
  const percentage = (numerator / denomeneator) * 100;
  const fixedPercentage = percentage.toFixed(0);
  return fixedPercentage;
};

const getHMSFormat = (timeInSeconds_) => {
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
          <div key={index} className="letter-tile">
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
  return (
    <div className="stats-container personal-stats">
      <div className="stat">
        <div className="stat-large">
          {getHMSFormat(personalStats.best_time)}
        </div>
        <div className="stat-label">הזמן הקצר ביותר שלך</div>
      </div>
      <h3 className="personal-title">המשחקים שלך</h3>
      <div className="stat">
        <div className="stat-large">{winPercentage}%</div>
        <div className="stat-label">
          {personalStats.wins} / {personalStats.total} הצלחות
        </div>
      </div>
    </div>
  );
};

const GlobalStats = () => {
  const globalStats = getGlobalStats();

  const globalWinPercentage = getFixedPercentage(
    globalStats.total_wins,
    globalStats.total_plays
  );
  return (
    <>
      <div className="stats-container global-stats">
        <div className="stat">
          <div className="stat-large">
            {getHMSFormat(globalStats.best_time)}
          </div>
          <div className="stat-label">
            הזמן הקצר ביותר <br /> {globalStats.user_name}
          </div>
        </div>
        <h3 className="global-title">היום</h3>
        <div className="stat">
          <div className="stat-large">{globalWinPercentage}%</div>
          <div className="stat-label">
            {globalStats.total_wins} / {globalStats.total_plays} הצליחו
          </div>
        </div>
      </div>
    </>
  );
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
    <>
      <h3> ...אם היית מחובר היו כאן סטטיסטיקות</h3>
      <span className="login-link" onClick={login}>
        להתחברות
      </span>
    </>
  );
};

const TimerToMidnight = ({
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
        <Top word={riddle.solution} riddle={riddle} gameStatus={gameStatus} />
        {isLoggedIn ? <Stats /> : <GuestUserMessage login={login} />}
        <Timer onTimeEnds={onTimeEnds} />
      </div>
    </div>
  );
};

export default TimerToMidnight;
