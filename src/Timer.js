import React, { useState, useEffect } from "react";

import "./Timer.css";

const getTimeToSolveText = (timeToSolveMs) => {
  const totalSeconds = parseInt(Math.floor(timeToSolveMs / 1000), 10);
  const totalMinutes = parseInt(Math.floor(totalSeconds / 60), 10);
  var totalHours = parseInt(Math.floor(totalMinutes / 60), 10);
  const timeToSolve =
    totalHours !== 0
      ? totalHours
      : totalMinutes !== 0
      ? totalMinutes
      : totalSeconds;
  const units =
    totalHours !== 0 ? "שעות" : totalMinutes !== 0 ? "דקות" : "שניות";
  return `פתרת ב ${timeToSolve} ${units}`;
};

const TimerToMidnight = ({ onTimeEnds, onClose, text, timeToSolve }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const timeToSolveText = timeToSolve ?  getTimeToSolveText(timeToSolve) : null ;
  useEffect(() => {
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (time.hours === 0 && time.minutes === 0 && time.seconds === 0)
        onTimeEnds();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [onTimeEnds]);

  function calculateTimeLeft() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 1, 0, 0);
    const difference = midnight - now;

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  }
  return (
    <div className="timer-modal-overlay unselectable">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        <h1>{text}</h1>
        {timeToSolveText && <h2>{timeToSolveText}</h2>}
        <h3>החידה הבאה בעוד</h3>
        <div className="time">
          {timeLeft.hours.toString().padStart(2, "0")}:
          {timeLeft.minutes.toString().padStart(2, "0")}:
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export default TimerToMidnight;
