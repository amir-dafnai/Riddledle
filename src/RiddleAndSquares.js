import { getStringLengths } from "./appUtils";
import { GAMESTATUS } from "./Consts";
import { Riddle } from "./Riddle";


export const RiddleAndSquares = ({
  riddle,
  gameEnded,
  gameStatus,
  currAnswer,
  guesses,
  numberOfGuesses,
  handleKeyDown,
}) => {
  const solutionToShow = "פתרון: " + [...riddle.solution].reverse().join("");
  return (
    <div>
      <div data-nosnippet>
        <h1 className="rtl-form unselectable">
          {" " + riddle.definition} {getStringLengths(riddle.solution)}
        </h1>
      </div>
      <div dir="rtl" className="solutionText unselectable unclickable">
        {gameEnded && gameStatus === GAMESTATUS.lose && solutionToShow}
      </div>
      {riddle.credit ? <h4 className="credit">By {riddle.credit}</h4> : null}
      <Riddle
        currAnswer={currAnswer}
        guesses={guesses}
        numberOfGuesses={numberOfGuesses}
        handleKeyDown={handleKeyDown}
        solution={riddle.solution}
        gameEnded={gameEnded}
      />
    </div>
  );
};
