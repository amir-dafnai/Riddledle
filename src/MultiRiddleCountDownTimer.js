import React, { useEffect, useState } from "react";
import "./CountdownTimer.css";

export const calcTimeLeft = (startTime, total = 60) => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const timeLeft = Math.max(total - elapsed, 0);
  return timeLeft;
};

export const CountdownTimer = ({
  timerStartTime,
  textToShow,
  setCounDownTimerEnded,
  gameEnded,
  timeEnded,
}) => {
  const [currtime, setCurrTime] = useState(calcTimeLeft(timerStartTime));

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameEnded || timeEnded) {
        clearInterval(interval);
        return;
      }
      const timeLeft = calcTimeLeft(timerStartTime);

      setCurrTime(timeLeft);
      if (timeLeft === 0) {
        clearInterval(interval);
        setCounDownTimerEnded(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerStartTime, setCounDownTimerEnded, gameEnded, timeEnded]);

  return (
    <div
      dir="rtl"
      className={`countdown-container unselectable unclickable ${
        !textToShow && currtime <= 5 && currtime > 0 ? "dramatic" : ""
      } `}
    >
      {!gameEnded && (textToShow || currtime)}
    </div>
  );
};

