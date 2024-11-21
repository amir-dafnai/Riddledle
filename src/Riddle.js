import { getEmptyAnswer } from "./appUtils";
import { MyKeyBoard } from "./KeyBoard";
import { RowOfSquares } from "./Squares";

export function Riddle({
  currAnswer,
  guesses,
  numberOfGuesses,
  allStyles,
  handleKeyDown,
  solution,
}) {
  const riddleSquares = [];
  for (let i = 0; i < numberOfGuesses; i++) {
    const currGuess =
      i < guesses.length
        ? guesses[i]
        : i === guesses.length
        ? currAnswer
        : getEmptyAnswer(solution);
    riddleSquares.push(
      <div key={i} className="word-container">
        <RowOfSquares
          key={i}
          currGuess={currGuess}
          nSquares={solution.length}
          styles={allStyles[i]}
          handleKeyDown={i === guesses.length ? handleKeyDown : null}
        />
      </div>
    );
  }
  return (
    <>
      {riddleSquares}
      <MyKeyBoard handleKeyDown={handleKeyDown} />
    </>
  );
}
