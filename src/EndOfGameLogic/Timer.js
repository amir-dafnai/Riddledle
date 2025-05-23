import { useEffect, useState } from "react";

export const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const timerDone = (time) => {
    return (
      (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0)
    );
  };

  useEffect(() => {
    if (timerDone(timeLeft)) {
      return;
    }
    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      setTimeLeft(time);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

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
      {!timerDone(timeLeft) ? 
      <h3 className="time">
        {`           החידה הבאה בעוד      
          ${timeLeft.hours.toString().padStart(2, "0")}:${timeLeft.minutes
          .toString()
          .padStart(2, "0")}:${timeLeft.seconds.toString().padStart(2, "0")}
            
          `}
      </h3>
      : 
      <h3>רענן לקבלת החידה הבאה</h3>}
    </>
  );
};
