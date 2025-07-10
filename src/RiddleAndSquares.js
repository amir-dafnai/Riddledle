import { getStringLengths } from "./appUtils";
import { GAMESTATUS } from "./Consts";
import { Riddle } from "./Riddle";
import "./RiddleAndSquares.css";

export const RiddleAndSquares = ({
  riddle,
  gameEnded,
  gameStatus,
  currAnswer,
  guesses,

  handleKeyDown,
  isMultiRiddle,
}) => {
  const solutionToShow = "פתרון: " + [...riddle.solution].reverse().join("");
  return (
    <div>
      <div data-nosnippet>
        <h1 className="rtl-form unselectable definition">
          {" " + riddle.definition} {getStringLengths(riddle.solution)}
        </h1>
      </div>
      <div dir="rtl" className="solutionText unselectable unclickable">
        {isMultiRiddle &&
          gameEnded &&
          gameStatus === GAMESTATUS.lose &&
          solutionToShow}
      </div>
      {!isMultiRiddle && riddle.credit ? (
        <h4 className="credit">By {riddle.credit}</h4>
      ) : null}
      <Riddle
        currAnswer={currAnswer}
        guesses={guesses}
        handleKeyDown={handleKeyDown}
        solution={riddle.solution}
        gameEnded={gameEnded}
      />
    </div>
  );
};
