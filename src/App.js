import { useEffect, useState } from "react";
import { getColors } from "./appUtils";
import {
  getNextSquareHebew,
  getNextSquareEnglish,
  getPrevSquareEnglish,
  getPrevSquareHebrew,
} from "./appUtils";
import { getEmptyAnswers, getDefaultStyles, arraysAreEqual } from "./appUtils";

import { getRandomEnglishRiddle, getRandomHebrewRiddle } from "./riddlesStack";

const LANG = "HEB";
const getRiddle =
  LANG === "HEB" ? getRandomHebrewRiddle : getRandomEnglishRiddle;
const getNextSquare =
  LANG === "HEB" ? getNextSquareHebew : getNextSquareEnglish;
const getPrevSquare =
  LANG === "HEB" ? getPrevSquareHebrew : getPrevSquareEnglish;

function getGameLostH1Text(solution, lang) {
  if (lang === "ENG") return `Too bad... The solution was ${solution.join("")}`;
  else {
    const solText = [...solution].reverse().join("");
    return `לא נורא... הפתרון הנכון הוא ${solText} `;
  }
}

function Square({ value, style }) {
  return (
    <div className="square" style={style}>
      {value}
    </div>
  );
}

function InvisibleSquare() {
  return <div className="invisibleSquare"> </div>;
}

function Squares({ currAnswer, styles, handleKeyDown }) {
  useEffect(() => {
    if (handleKeyDown == null) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  const squares = [];
  for (let i = 0; i < currAnswer.length; i++) {
    if (currAnswer[i] !== " ") {
      squares.push(
        <Square key={i} value={currAnswer[i]} style={styles[i]}>
          {" "}
        </Square>
      );
    } else squares.push(<InvisibleSquare key={i}> </InvisibleSquare>);
  }
  return squares;
}

function Riddle({
  numberOfGuesses,
  answers,
  allStyles,
  handleKeyDown,
  currGuess,
}) {
  const riddles = [];
  for (let i = 0; i < numberOfGuesses; i++) {
    riddles.push(
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
  return riddles;
}

function NextRiddleButton({ handleClick }) {
  return <button onClick={handleClick}>Next Riddle</button>;
}

function GameWon({ handleClick }) {
  return (
    <>
      <h1>You Got It!</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
function GameLost({ solution, handleClick }) {
  console.log("SOLUTION", solution);
  return (
    <>
      <h1>{getGameLostH1Text(solution, LANG)}</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}

function Game({ riddle, setRiddle, progress }) {
  const solution = riddle.solution;
  const numberOfGuesses = 3;
  console.log(progress);
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
    console.log(LANG , progress.lang , progress.lang === LANG)
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
  }, [answers, allStyles, guesses, riddle]);

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
    if (event.key === "Backspace")
      setNewAnswer(getPrevSquare(currAnswer, solution), "");
    else if (
      LANG === "ENG" &&
      "abcdefghijklmnopqrstuvwxyz".indexOf(event.key.toLowerCase()) !== -1
    )
      setNewAnswer(getNextSquare(currAnswer), event.key.toUpperCase());
    else if (
      LANG === "HEB" &&
      "אבגדהוזחטיכלמנסעפצקרשתךםןףץ".indexOf(event.key) !== -1
    )
      setNewAnswer(getNextSquare(currAnswer), event.key);
    else if (
      event.key === "Enter" &&
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

  return (
    <Game
      riddle={progress.riddle ? progress.riddle : riddle}
      setRiddle={setRiddle}
      progress={progress}
    />
  );
};
export default App;
