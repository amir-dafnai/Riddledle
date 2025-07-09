import React, { useEffect, useState } from "react";
import { getEmptyAnswer, getUrl } from "./appUtils";
import { RiddleAndSquares } from "./RiddleAndSquares";
import { GAMESTATUS } from "./Consts";
import { useNavigate } from "react-router-dom";

import "./YesterdayPage.css";
import { getWhatsAppMessage, SocialIcons } from "./SocialIcons";

function YesterdayPage() {
  const [riddleGroup, setRiddleGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getYesterDaysRiddle = async () => {
      const url = getUrl();
      const response = await fetch(`${url}get_yesterdays_riddle`);
      if (!response.ok) return;
      const data = await response.json();
      if (riddleGroup && riddleGroup.id === data.riddle_group.id) return;
      setRiddleGroup(data.riddle_group);
    };
    getYesterDaysRiddle();
  }, [riddleGroup]);

  if (!riddleGroup) return <div>Loading...</div>;

  const currRiddle = riddleGroup.group[0];
  return (
    <div>
      <div className="riddledle-logo">
        <h1 className="unclickable">Riddledle</h1>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>
        פתור את החידה של היום
      </button>
    <h4 className="header">החידה של אתמול:</h4>
      <RiddleAndSquares
        riddle={currRiddle}
        gameStatus={GAMESTATUS.win}
        currAnswer={getEmptyAnswer(currRiddle.solution)}
        numberOfGuesses={4}
        guesses={[currRiddle.solution]}
      />
      <SocialIcons watsAppMessage={getWhatsAppMessage(false, false)} />
    </div>
  );
}

export default YesterdayPage;
