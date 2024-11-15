import { useEffect, useState } from "react";
import { getColors } from "./appUtils";
import { getEmptyAnswers, getDefaultStyles, arraysAreEqual } from "./appUtils";

import { MyKeyBoard } from "./KeyBoard";
import { GameLost } from "./GameLost";
import { Squares } from "./Squares";
import { LANG, getRiddle, getPrevSquare, getNextSquare ,isValidLetter} from "./LANG";
import { GameWon } from "./GameWon";

function Riddle({
  numberOfGuesses,
  answers,
  allStyles,
  handleKeyDown,
  currGuess,
}) {
  const riddleSquares = [];
  for (let i = 0; i < numberOfGuesses; i++) {
    riddleSquares.push(
      <div key={i} className="word-container">
        <Squares
          key={i}
          currAnswer={answers[i]}
          styles={allStyles[i]}
          handleKeyDown={currGuess === i ? handleKeyDown : null}
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

export function NextRiddleButton({ handleClick }) {
  return <button onClick={handleClick}>Next Riddle</button>;
}

function Game({ riddle, setRiddle, progress }) {
  const solution = riddle.solution;
  const numberOfGuesses = 3;

  const [answers, setAnswers] = useState(
    progress.answers
      ? progress.answers
      : getEmptyAnswers(solution, numberOfGuesses)
  );
  const [allStyles, setAllStyles] = useState(
    progress.allStyles
      ? progress.allStyles
      : getDefaultStyles(solution, numberOfGuesses)
  );
  const [guesses, setGuesses] = useState(
    progress.guesses ? progress.guesses : []
  );
  const currGuess = guesses.length;
  const currAnswer = answers[currGuess];
  const gameStatus = arraysAreEqual(solution, answers[currGuess - 1])
    ? "win"
    : currGuess === numberOfGuesses
    ? "lose"
    : "playing";

  useEffect(() => {
    // Save to localStorage whenever progress changes
    if (progress.lang && progress.lang !== LANG)
      localStorage.setItem("progress", JSON.stringify({}));
    else
      localStorage.setItem(
        "progress",
        JSON.stringify({
          riddle: riddle,
          answers: answers,
          allStyles: allStyles,
          guesses: guesses,
          lang: LANG,
        })
      );
  }, [answers, allStyles, guesses, riddle, progress.lang]);

  function reset() {
    const newRiddle = getRiddle();
    setAnswers(getEmptyAnswers(newRiddle.solution, numberOfGuesses));
    setAllStyles(getDefaultStyles(newRiddle.solution, numberOfGuesses));
    setGuesses([]);
    setRiddle(newRiddle);
    localStorage.setItem("progress", JSON.stringify({}));
  }

  function onEnterClicked(solution, currAnswer) {
    let newStyles = allStyles[currGuess].slice();
    const colors = getColors(solution, currAnswer);
    for (let i = 0; i < solution.length; i++)
      newStyles[i] = { backgroundColor: colors[i] };
    let newAllStyles = allStyles.slice();
    newAllStyles[currGuess] = newStyles;
    setAllStyles(newAllStyles);
    let newGuesses = guesses.slice();
    newGuesses.push(currAnswer);
    setGuesses(newGuesses);
  }

  function setNewAnswer(currSquare, key) {
    let newAnswers = answers.slice();
    currAnswer[currSquare] = key;
    newAnswers[currGuess] = currAnswer;
    setAnswers(newAnswers);
  }

  function handleKeyDown(event) {
    if (gameStatus !== "playing") return;

    const value = event.key || event;
    console.log(value);
    if (value === "Backspace" || value === "{backspace}")
      setNewAnswer(getPrevSquare(currAnswer, solution), "");
    else if (isValidLetter(value))
      setNewAnswer(getNextSquare(currAnswer), value.toUpperCase());
    else if (
      (value === "Enter" || value === "{enter}") &&
      currAnswer.every((element) => element !== "")
    )
      onEnterClicked(solution, currAnswer);
  }
  return (
    <>
      <div className="riddle-container">
        <h1>{riddle.definition}</h1>
        <Riddle
          numberOfGuesses={numberOfGuesses}
          answers={answers}
          allStyles={allStyles}
          handleKeyDown={handleKeyDown}
          currGuess={currGuess}
        />

        {gameStatus === "win" && <GameWon handleClick={reset} />}
        {gameStatus === "lose" && (
          <GameLost solution={solution} handleClick={reset} />
        )}
      </div>
    </>
  );
}

const App = () => {
  const [riddle, setRiddle] = useState(getRiddle());
  const progress = JSON.parse(localStorage.getItem("progress") || "{}");
  console.log(riddle);
  return (
    <Game
      riddle={progress.riddle ? progress.riddle : riddle}
      setRiddle={setRiddle}
      progress={progress}
    />
  );
};
export default App;
