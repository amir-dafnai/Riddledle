import React, { useEffect, useState } from "react";
import { getEmptyAnswer, getUrl } from "./appUtils";
import { RiddleAndSquares } from "./RiddleAndSquares";
import { GAMESTATUS } from "./Consts";
import { useNavigate } from "react-router-dom";

import "./YesterdayPage.css";
import { getWhatsAppMessage, SocialIcons } from "./SocialIcons";
import { normalizeRiddleGroup } from "./language";
import { isSingleRiddle } from "./RiddlesGroupUtils";
import { RiddlesResults } from "./RiddlesResults";



function YesterdayPage() {
  const [riddleGroup, setRiddleGroup] = useState(null);
  const [currRiddle, setCurrRiddle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getYesterDaysRiddle = async () => {
      const url = getUrl();
      const response = await fetch(`${url}get_yesterdays_riddle`);
      if (!response.ok) return;
      const data = await response.json();
      console.log(data);
      if (riddleGroup && riddleGroup.id === data.riddle_group.id) return;
      const newRiddleGroup = normalizeRiddleGroup(data.riddle_group);
      setRiddleGroup(newRiddleGroup);
      setCurrRiddle(newRiddleGroup.group[0]);
    };
    getYesterDaysRiddle();
  }, [riddleGroup]);

  if (!riddleGroup || !currRiddle) return <div>Loading...</div>;
  

  const isMultiRiddle = !isSingleRiddle(riddleGroup);
  return (
    <div>
      <div className="riddledle-logo">
        <h1 className="unclickable">Riddledle</h1>
      </div>

      <h3 className="header">
        {isMultiRiddle ? "החידות של אתמול:" : " החידה של אתמול:"}
      </h3>
      <h5 dir="rtl" className="winner">   מקום ראשון: {riddleGroup.winner.user_name} 🏆</h5>
      <RiddleAndSquares
        riddle={currRiddle}
        gameStatus={GAMESTATUS.win}
        currAnswer={getEmptyAnswer(currRiddle.solution)}
        guesses={[currRiddle.solution]}
        gameEnded={true}
      />
      {isMultiRiddle && (
        <RiddlesResults
          riddleGroup={riddleGroup}
          currRiddle={currRiddle}
          setRiddle={setCurrRiddle}
          gameEnded={true}
          results={riddleGroup.group.map(_=>"win")}
        />
      )}
      <button className="back-button" onClick={() => navigate("/")}>
        פתור את החידה של היום
      </button>
      <SocialIcons watsAppMessage={getWhatsAppMessage(false, false)} />
    </div>
  );
}

export default YesterdayPage;
