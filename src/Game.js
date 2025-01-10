import { useEffect, useState } from "react";
import { SuggestRiddleForm } from "./SuggestRiddle";

import {
  getEmptyAnswer,
  arraysAreEqual,
  textDirection,
  getLastLetterIndices,
  getStringLengths,
  getUrl,
  getNextSquare,
  getPrevSquare,
  getMaxDelay,
} from "./appUtils";
import { getKeyboardButtonTheme } from "./KeyBoard";
import { storeProgress, getProgress, getUserData } from "./localStorageUtils";
import { isValidLetter, convertToLastLetter } from "./appUtils";
import { Riddle } from "./Riddle";
import { StatisticsModal } from "./Stats";
import { GAMESTATUS, VIEWS } from "./Consts";
import TimerToMidnight from "./Timer";
import { MyKeyBoard } from "./KeyBoard";

const getGameLostText = (solution) => {
  const solText = [...solution].reverse().join("");
  return `לא נורא... הפתרון הנכון הוא ${solText} `;
};

const getTimerText = (gameStatus, solution) => {
  const winText = "כל הכבוד!";
  const lostText = getGameLostText(solution);
  return gameStatus === GAMESTATUS.win ? winText : lostText;
};

const getGameStatus = (solution, guesses, numberOfGuesses) => {
  const currGuess = guesses.length;
  const status = arraysAreEqual(solution, guesses[guesses.length - 1])
    ? GAMESTATUS.win
    : currGuess === numberOfGuesses
    ? GAMESTATUS.lose
    : GAMESTATUS.playing;
  return status;
};

export function Game({ riddle, reset, viewStatus, setViewStatus }) {
  const progress = getProgress();

  const solution = riddle.solution;
  const numberOfGuesses = 4;
  const [currAnswer, setCurrAnswer] = useState(getEmptyAnswer(solution));
  const [guesses, setGuesses] = useState(
    progress.guesses ? progress.guesses : []
  );
  const gameStatus = getGameStatus(solution, guesses, numberOfGuesses);
  const isLastLetter = getLastLetterIndices(solution).includes(
    getNextSquare(currAnswer)
  );
  const [timerWasClosed, setTimerWasClosed] = useState(false);
  const [animationEnded, setAnimationEnded] = useState(true);
  const [keyBoardThem, setKeyBoardTheme] = useState(
    getKeyboardButtonTheme(guesses, solution)
  );

  const shouldShowTimer = () => {
    return (
      animationEnded &&
      [GAMESTATUS.win, GAMESTATUS.lose].includes(gameStatus) &&
      !timerWasClosed
    );
  };

  useEffect(() => {
    const animationDuration = getMaxDelay(solution) * 3; // Replace this with your animation's duration in milliseconds
    const timer = setTimeout(() => {
      setAnimationEnded(true);
      setKeyBoardTheme(getKeyboardButtonTheme(guesses, solution));
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [guesses, solution]);

  useEffect(() => {
    storeProgress({
      riddle: riddle,
      guesses: guesses,
    });
  }, [guesses, riddle]);

  function setNewAnswer(currSquare, key) {
    const newAns = currAnswer.slice();
    newAns[currSquare] = key;
    setCurrAnswer(newAns);
  }

  function onEnterClicked() {
    const newGuesses = [...guesses, currAnswer];
    const newStatus = getGameStatus(solution, newGuesses, numberOfGuesses);
    if (newStatus !== "playing") {
      storeStats(newGuesses, newStatus);
    }
    setAnimationEnded(false);
    setGuesses(newGuesses);
    setCurrAnswer(getEmptyAnswer(solution));
  }

  function storeStats(newGuesses, newStatus) {
    const guessesAsStrings = newGuesses.map((ans) =>
      [...ans].reverse().join("")
    );
    const url = getUrl();
    const userData = getUserData();
    fetch(`${url}insert_stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        riddle_id: riddle.id,
        status: newStatus,
        guesses: guessesAsStrings,
        user_name: userData.name,
        email: userData.email,
      }),
    });
  }

  function handleKeyDown(event) {
    if (
      gameStatus !== "playing" ||
      viewStatus !== VIEWS.game ||
      !animationEnded
    )
      return;
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
      onEnterClicked();
    }
  }

  return (
    <>
      <div className="riddle-container">
        {viewStatus === VIEWS.form && (
          <SuggestRiddleForm setViewStatus={setViewStatus} />
        )}
        {viewStatus === VIEWS.stats && (
          <StatisticsModal setViewStatus={setViewStatus} />
        )}
        <h1 className={textDirection}>
          {riddle.definition} {getStringLengths(riddle.solution)}
        </h1>
        {riddle.credit ? <h4>By {riddle.credit}</h4> : null}
        <Riddle
          currAnswer={currAnswer}
          guesses={guesses}
          numberOfGuesses={numberOfGuesses}
          handleKeyDown={handleKeyDown}
          solution={solution}
        />
        <MyKeyBoard handleKeyDown={handleKeyDown} buttonTheme={keyBoardThem} />

        {shouldShowTimer() ? (
          <TimerToMidnight
            onClose={() => setTimerWasClosed(true)}
            onTimeEnds={reset}
            text={getTimerText(gameStatus, solution)}
          />
        ) : null}
      </div>
    </>
  );
}
