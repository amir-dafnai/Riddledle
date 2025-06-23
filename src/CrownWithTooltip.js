import { useState } from "react";
import "./toolTip.css";

export const CrownWithTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleHover = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000); // Hide after 2s
  };

  return (
    <span className="tooltip-wrapper unselectable" onClick={handleHover}>
      👑
      {showTooltip && <div className="tooltip-text">יותר משתי משמעויות</div>}
    </span>
  );
};
