import { getStringLengths } from "./appUtils";
import { GAMESTATUS } from "./Consts";
import { getDirection, getLanguage, isEnglish } from "./language";
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
  const language = getLanguage(riddle);
  const direction = getDirection(language);
  // The solution arrives in display order, which reads backwards in Hebrew.
  const solutionText = isEnglish(language)
    ? riddle.solution.join("")
    : [...riddle.solution].reverse().join("");
  const solutionToShow = isEnglish(language)
    ? "Solution: " + solutionText
    : "פתרון: " + solutionText;
  return (
    <div>
      <div data-nosnippet>
        <h1
          dir={direction}
          className={`${direction}-form unselectable definition`}
        >
          {" " + riddle.definition} {getStringLengths(riddle.solution)}
        </h1>
      </div>
      <div dir={direction} className="solutionText unselectable unclickable">
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
