import React, { useState, useEffect } from "react";
import "./Timer.css";
import { getGlobalStats, getUserStats } from "./localStorageUtils";

const getFixedPercentage = (numerator, denomeneator) => {
  const percentage = (numerator / denomeneator) * 100;
  const fixedPercentage = percentage !==100 ?  percentage.toFixed(1): 100;
  return fixedPercentage;
};

const getTimeToSolve = (start, end) => {
  const diffInSeconds = Math.round((end - start) / 1000);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

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

const TimerToMidnight = ({ onTimeEnds, onClose, riddle }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const word = riddle.solution;
  const timeToSolve = getTimeToSolve(riddle.startTime, riddle.endTime);
  const personalStats = getUserStats();
  const globalStats = getGlobalStats();
  const winPercentage = getFixedPercentage(
    personalStats.wins , personalStats.total
  );
  const globalWinPercentage = getFixedPercentage(
    globalStats.total_wins , globalStats.total_plays
  );

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
    <div className="timer-modal-overlay unselectable">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>

        {/* Header Section */}
        <h2 className="win-message">!הצלחת</h2>
        <div className="word-display">
          {word.map((letter, index) => (
            <div key={index} className="letter-tile">
              {letter}
            </div>
          ))}
        </div>

        {/* Time to Solve */}
        <div className="stat-large stats-time-to-solve">{timeToSolve}</div>
        <div className="stat-label"> זמן פתרון </div>

        {/* Personal Stats */}
        <div className="stats-container personal-stats">
          <div className="stat">
            <div className="stat-large">{personalStats.best_time}</div>
            <div className="stat-label">הזמן הקצר ביותר שלך</div>
          </div>
          <div className="stat">
            <div className="stat-large">{winPercentage}%</div>
            <div className="stat-label">
              {personalStats.wins} / {personalStats.total} הצלחות
            </div>
          </div>
          <h3 className="personal-title">הסטטיסטיקות שלך</h3>
        </div>

        {/* Global Stats */}
        <div className="stats-container global-stats">
          <div className="stat">
            <div className="stat-large">{globalStats.best_time}</div>
            <div className="stat-label">
              הזמן הקצר ביותר <br /> {globalStats.user_name}
            </div>
          </div>
          <div className="stat">
            <div className="stat-large">{globalWinPercentage}%</div>
            <div className="stat-label">
              {globalStats.total_wins} / {globalStats.total_plays} הצליחו
            </div>
          </div>
          <h3 className="global-title">סטטיסטיקות גלובליות</h3>
        </div>

        {/* Countdown Timer */}
        <div className="timer">
          <h3>החידה הבאה בעוד</h3>
          <div className="time">
            {timeLeft.hours.toString().padStart(2, "0")}:
            {timeLeft.minutes.toString().padStart(2, "0")}:
            {timeLeft.seconds.toString().padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimerToMidnight;
