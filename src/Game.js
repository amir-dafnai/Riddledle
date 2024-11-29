import { useEffect, useState } from "react";
import {
  getEmptyAnswer,
  arraysAreEqual,
  setProgress,
  getProgress,
  textDirection,
  getLastLetterIndices,
  getStringLengths,
} from "./appUtils";
import { GameLost } from "./GameLost";
import {
  getPrevSquare,
  getNextSquare,
  isValidLetter,
  convertToLastLetter,
} from "./LANG";
import { GameWon } from "./GameWon";
import { Riddle } from "./Riddle";

export function Game({ riddle, reset }) {
  const progress = getProgress();
  const solution = riddle.solution;
  const numberOfGuesses = 3;
  const [currAnswer, setCurrAnswer] = useState(getEmptyAnswer(solution));
  const [guesses, setGuesses] = useState(
    progress.guesses ? progress.guesses : []
  );
  const currGuess = guesses.length;
  const gameStatus = arraysAreEqual(solution, guesses[guesses.length - 1])
    ? "win"
    : currGuess === numberOfGuesses
    ? "lose"
    : "playing";

  const isLastLetter = getLastLetterIndices(solution).includes(
    getNextSquare(currAnswer)
  );

  useEffect(() => {
    setProgress({
      riddle: riddle,
      guesses: guesses,
    });
  }, [guesses, riddle]);

  function setNewAnswer(currSquare, key) {
    const newAns = currAnswer.slice();
    newAns[currSquare] = key;
    setCurrAnswer(newAns);
  }

  function handleKeyDown(event) {
    if (gameStatus !== "playing") return;
    const value = event.key || event;
    if (value === "Backspace" || value === "{Backspace}")
      setNewAnswer(getPrevSquare(currAnswer, solution), "");
    else if (isValidLetter(value, isLastLetter)) {
      setNewAnswer(
        getNextSquare(currAnswer),
        isLastLetter ? convertToLastLetter(value) : value
      );
    } else if (
      (value === "Enter" || value === "{Enter}") &&
      currAnswer.every((element) => element !== "")
    ) {
      setGuesses((oldGuesses) => [...oldGuesses, currAnswer]);
      setCurrAnswer(getEmptyAnswer(solution));
    }
  }
  return (
    <>
      <div className="riddle-container">
        <h1 className={textDirection}>{riddle.definition} {getStringLengths(riddle.solution)}</h1>
        <Riddle
          currAnswer={currAnswer}
          guesses={guesses}
          numberOfGuesses={numberOfGuesses}
          handleKeyDown={handleKeyDown}
          solution={solution}
        />

        {gameStatus === "win" && <GameWon handleClick={reset} />}
        {gameStatus === "lose" && (
          <GameLost solution={solution} handleClick={reset} />
        )}
      </div>
    </>
  );
}
