import { useEffect, useState } from "react";
import { SuggestRiddleForm } from "./SuggestRiddle";

import {
  getEmptyAnswer,
  arraysAreEqual,
  getLastLetterIndices,
  getStringLengths,
  getNextSquare,
  getPrevSquare,
  getMaxDelay,
} from "./appUtils";
import { getKeyboardButtonTheme } from "./KeyBoard";
import {
  storeProgress,
  getProgress,
  getUserData,
  storeUserStats,
} from "./localStorageUtils";
import { isValidLetter, convertToLastLetter } from "./appUtils";
import { Riddle } from "./Riddle";
import {
  fetchAndStoreGlobalStats,
  fetchStats,
  insertStats,
  StatisticsModal,
} from "./Stats";
import { GAMESTATUS, VIEWS } from "./Consts";
import EndOfGameForm from "./EndOfGameLogic/EndOfGame";
import { MyKeyBoard } from "./KeyBoard";
import { SocialIcons, getWhatsAppMessage } from "./SocialIcons";
import { areWordsValid } from "./WordValidation";

const getTimeToSolve = (start, end) => {
  const timeToSolveSeconds = ((end - start) / 1000).toFixed(2);
  return timeToSolveSeconds;
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

export function Game({ riddle, viewStatus, setViewStatus, isLoggedIn, login }) {
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

  const [shoudlFetchStats, setShouldUpdateStats] = useState(true);
  const [invalidWordMessage, setInvalidWordMessage] = useState(false);

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
    const progress = getProgress();
    storeProgress({
      ...progress,
      riddle: riddle,
      guesses: guesses,
    });
  }, [guesses, riddle]);

  useEffect(() => {
    const fetcAndStorehStats = async (email) => {
      const stats = await fetchStats(email);
      storeUserStats(stats);
    };

    fetchAndStoreGlobalStats(riddle);
    const userData = getUserData();
    const email = userData && userData.email;
    if (email && shoudlFetchStats) {
      fetcAndStorehStats(email);
      setShouldUpdateStats(false);
    }
  }, [shoudlFetchStats, riddle]);

  function setNewAnswer(currSquare, key) {
    const newAns = currAnswer.slice();
    newAns[currSquare] = key;
    setCurrAnswer(newAns);
  }

  function onEnterClicked() {
    const newGuesses = [...guesses, currAnswer];
    const newStatus = getGameStatus(solution, newGuesses, numberOfGuesses);
    if (newStatus !== GAMESTATUS.playing) {
      riddle.endTime = Date.now();
      sendStats(newGuesses, newStatus);
    }
    setAnimationEnded(false);
    setGuesses(newGuesses);
    setCurrAnswer(getEmptyAnswer(solution));
  }

  const sendStats = async (newGuesses, newStatus) => {
    const guessesAsStrings = newGuesses.map((ans) =>
      [...ans].reverse().join("")
    );
    const userData = getUserData();
    const body = {
      riddle_id: riddle.id,
      status: newStatus,
      guesses: guessesAsStrings,
      user_name: userData.name,
      email: userData.email,
      time_to_solve: getTimeToSolve(riddle.startTime, riddle.endTime),
    };
    const response = insertStats(body);
    await response;
    setShouldUpdateStats(true);
  };

  async function handleKeyDown(event) {
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
      const isValidHebrew = arraysAreEqual(currAnswer , solution) || await areWordsValid([...currAnswer].reverse());
      if (!isValidHebrew) {
        setInvalidWordMessage(true);
        setTimeout(() => setInvalidWordMessage(false), 2000); // Hide after 2s
      } else onEnterClicked();
    }
  }

  return (
    <>
      <div className="riddle-container">
        {viewStatus === VIEWS.form && (
          <SuggestRiddleForm
            setViewStatus={setViewStatus}
            isLoggedIn={isLoggedIn}
            login={login}
          />
        )}
        {viewStatus === VIEWS.stats && (
          <StatisticsModal
            setViewStatus={setViewStatus}
            isLoggedIn={isLoggedIn}
            login={login}
          />
        )}
        <div data-nosnippet>
          <h1 className="rtl-form unselectable">
            {riddle.definition} {getStringLengths(riddle.solution)}
          </h1>
        </div>
        {riddle.credit ? <h4>By {riddle.credit}</h4> : null}
        <div className="tooltip-container">
          {invalidWordMessage && (
            <div dir="rtl" className="tooltip">נא להכניס מילה בעברית!</div>
          )}
        </div>
        <Riddle
          currAnswer={currAnswer}
          guesses={guesses}
          numberOfGuesses={numberOfGuesses}
          handleKeyDown={handleKeyDown}
          solution={solution}
        />
        <MyKeyBoard handleKeyDown={handleKeyDown} buttonTheme={keyBoardThem} />
        {shouldShowTimer() ? (
          <EndOfGameForm
            onClose={() => setTimerWasClosed(true)}
            gameStatus={gameStatus}
            riddle={riddle}
            isLoggedIn={isLoggedIn}
            login={login}
          />
        ) : null}
        <SocialIcons
          watsAppMessage={getWhatsAppMessage(isLoggedIn, gameStatus)}
        />
      </div>
    </>
  );
}
