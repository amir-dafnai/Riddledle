import React, { useState, useEffect } from "react";
import "./Timer.css";
import { getGlobalStats, getUserStats } from "./localStorageUtils";

const TimerToMidnight = ({ onTimeEnds, onClose, riddle }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const word = riddle.solution;
  const timeToSolve = ((riddle.endTime - riddle.startTime) / 1000).toFixed(2);
  const personalStats = getUserStats();
  const globalStats = getGlobalStats();
  const winPercentage = ((personalStats.wins / personalStats.total) * 100).toFixed(1);
  const globalWinPercentage = ((globalStats.total_wins / globalStats.total_plays) * 100).toFixed(1);

  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) onTimeEnds();
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
        <div className="stat-label">זמן פתרון</div>

        

        {/* Personal Stats */}
        <div className="stats-container personal-stats">
          <h3 className="personal-title">הסטטיסטיקות שלך</h3>
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
        </div>

        

        {/* Global Stats */}
        <div className="stats-container global-stats">
          <h3 className="global-title">סטטיסטיקות גלובליות</h3>
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
