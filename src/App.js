import { useEffect, useState } from "react";
import {
  getEmptyAnswers,
  getDefaultStyles,
  arraysAreEqual,
  setProgress,
  getColors,
  getProgress,
  textDirection,
} from "./appUtils";

import { MyKeyBoard } from "./KeyBoard";
import { GameLost } from "./GameLost";
import { Squares } from "./Squares";
import {
  LANG,
  getRiddle,
  getPrevSquare,
  getNextSquare,
  isValidLetter,
} from "./LANG";
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

function Game({ riddle, reset }) {
  const progress = getProgress()
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
    setProgress({
      riddle: riddle,
      answers: answers,
      allStyles: allStyles,
      guesses: guesses,
    });
  }, [answers, allStyles, guesses, riddle]);

  function onEnterClicked(solution, currAnswer) {
    let newStyles = allStyles[currGuess].slice();
    const colors = getColors(solution, currAnswer);
    for (let i = 0; i < solution.length; i++)
      newStyles[i] = { backgroundColor: colors[i] };
    let newAllStyles = allStyles.slice();
    newAllStyles[currGuess] = newStyles;
    setAllStyles(newAllStyles);
    setGuesses((oldGuesses) => [...oldGuesses, currAnswer]);
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
        <h1 className={textDirection}>{riddle.definition}</h1>
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

const useRiddle = (lang) => {
  const [riddle, setRiddle] = useState(getProgress().riddle || {});
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:5000/api/get_riddle?lang=${LANG}&new=${
          riddle === null
        }`
      );
      const data = await response.json();
      if (riddle &&  riddle.id === data.riddle.id && data.riddle.lang === lang) return
      setProgress({});
      setRiddle(data.riddle);

    };
    fetchData();
  }, [riddle,lang]); // Empty dependency array ensures this runs only once on mount

  return [riddle, setRiddle];
};

const App = () => {
  const [riddle, setRiddle] = useRiddle(LANG);
  if (riddle && riddle.lang !==LANG) setRiddle(null)
  return (
    riddle && riddle.lang ===LANG && (
      <Game
        riddle={riddle}
        reset={() => {
          setRiddle(null);
          setProgress({});
        }}
      />
    )
  );
};
export default App;
