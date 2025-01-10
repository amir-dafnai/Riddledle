import React, { useState, useEffect } from "react";

import './Timer.css'



const TimerToMidnight = ({onTimeEnds, onClose , text}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
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
    midnight.setHours(24, 0, 0, 0); // Set time to the next midnight
    const difference = midnight - now;

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  }
  return (
    <div className="timer-modal-overlay">
      <div className="timer-modal-content">
        <button className="timer-close-button" onClick={onClose}>
          ✖
        </button>
        <h1>{text}</h1>
        <h2>החידה הבאה בעוד</h2>
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
