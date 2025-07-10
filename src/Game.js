import { useEffect, useState } from "react";
import { SuggestRiddleForm } from "./SuggestRiddle";
import "./Game.css";

import {
  getEmptyAnswer,
  arraysAreEqual,
  getLastLetterIndices,
  getNextSquare,
  getPrevSquare,
  getMaxDelay,
} from "./appUtils";
import { getKeyboardButtonTheme } from "./KeyBoard";
import {
  storeProgress,
  getProgress,
  getUserData,
  getUserStats,
  getLeaderBoardStats,
} from "./localStorageUtils";
import { isValidLetter, convertToLastLetter } from "./appUtils";
import { fetchAndStoreAllStats, insertStats, StatisticsModal } from "./Stats";
import { GAMESTATUS, NumberOfGuesses, VIEWS } from "./Consts";
import EndOfGameForm from "./EndOfGameLogic/EndOfGame";
import { MyKeyBoard } from "./KeyBoard";
import { SocialIcons, getWhatsAppMessage } from "./SocialIcons";
import { areWordsValid } from "./WordValidation";
import {
  getNextRiddle,
  getNumRiddlesLeft,
  isLastRiddle,
  isSingleRiddle,
  wonAll,
} from "./RiddlesGroupUtils";
import { calcTimeLeft, CountdownTimer } from "./MultiRiddleCountDownTimer";
import { getRiddlesResults, RiddlesResults } from "./RiddlesResults";
import { RiddleAndSquares } from "./RiddleAndSquares";
import HowToPlayRules from "./HowToPlay";

const getTimeToSolve = (start, end) => {
  const timeToSolveSeconds = ((end - start) / 1000).toFixed(2);
  return timeToSolveSeconds;
};

export const getGameStatus = (riddle, guesses) => {
  const currGuess = guesses.length;

  const status = arraysAreEqual(riddle.solution, guesses[guesses.length - 1])
    ? GAMESTATUS.win
    : currGuess === NumberOfGuesses
    ? GAMESTATUS.lose
    : GAMESTATUS.playing;

  return status;
};

const setNextRiddle = (riddle, riddleGroup, setRiddle) => {
  const nextRiddle = getNextRiddle(riddle, riddleGroup.group);
  if (nextRiddle) {
    nextRiddle.startTime = Date.now();
    setRiddle(nextRiddle);
  }
};

const calcEndOfGameText = (timeEnded, gameEnded, nRiddlesLeft) => {
  const t1 = "נגמר הזמן";
  const t2 = "(נשארו עוד";
  const t3 = `${nRiddlesLeft}`;
  const t4 = "חידות)";
  const lastRiddleText = "(חידה אחרונה)";
  const isLastRiddle = nRiddlesLeft === 1;
  const words = isLastRiddle ? [t1, lastRiddleText] : [t1, t2, t3, t4];

  const textToShow = words.join(" ");
  const text = timeEnded ? textToShow : gameEnded ? "כל הכבוד! 🎉" : null;

  return text;
};

export function Game({
  riddle,
  viewStatus,
  setViewStatus,
  userDetails,
  login,
  riddleGroup,
  setRiddle,
  timerWasClosed,
  setTimerWasClosed,
}) {
  const [stats, setStats] = useState({
    userStats: getUserStats(),
    leaderBoardStats: getLeaderBoardStats(),
  });
  const progress = getProgress();
  const currRiddleProgress = getProgress()[riddle.id] || {};
  const isLoggedIn = userDetails.loggedIn;
  const solution = riddle.solution;
  const [currAnswer, setCurrAnswer] = useState(getEmptyAnswer(solution));

  const [guesses, setGuesses] = useState(
    currRiddleProgress.guesses ? currRiddleProgress.guesses : []
  );
  const gameStatus = getGameStatus(riddle, guesses);

  const isLastLetter = getLastLetterIndices(solution).includes(
    getNextSquare(currAnswer)
  );

  const [animationEnded, setAnimationEnded] = useState(true);
  const [keyBoardThem, setKeyBoardTheme] = useState(
    getKeyboardButtonTheme(guesses, solution, currAnswer)
  );

  const [invalidWordMessage, setInvalidWordMessage] = useState(false);
  const [gameEnded, setGameEnded] = useState(Boolean(progress.gameEnded));

  const isMultiRiddle = !isSingleRiddle(riddleGroup);
  const timerStartTime = parseInt(riddleGroup.group[0].startTime, 10);

  const [CountdownTimerEnded, setCounDownTimerEnded] = useState(
    Boolean(progress.CountdownTimerEnded)
  );
  const isWinner = wonAll(riddleGroup) && !CountdownTimerEnded;

  useEffect(() => {
    if (
      [GAMESTATUS.win, GAMESTATUS.lose].includes(gameStatus) &&
      !gameEnded &&
      animationEnded
    ) {
      if (isLastRiddle(riddle, riddleGroup.group)) setGameEnded(true);
      if (isMultiRiddle) setNextRiddle(riddle, riddleGroup, setRiddle);
    }
  }, [
    riddle,
    riddleGroup,
    setRiddle,
    animationEnded,
    gameStatus,
    gameEnded,
    isMultiRiddle,
  ]);

  const showEndOfGameForm = () => {
    const val = gameEnded && !timerWasClosed;
    return val;
  };

  useEffect(() => {
    const animationDuration = getMaxDelay(solution); // Replace this with your animation's duration in milliseconds
    const timer = setTimeout(() => {
      setAnimationEnded(true);
      setKeyBoardTheme(getKeyboardButtonTheme(guesses, solution, currAnswer));
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [guesses, solution, currAnswer]);

  useEffect(() => {
    const progress = getProgress();
    storeProgress({
      ...progress,
      riddle: riddle,
      guesses: guesses,
      riddleGroup: riddleGroup,
      [riddle.id]: { guesses: guesses },
      gameEnded: gameEnded,
      CountdownTimerEnded: CountdownTimerEnded,
    });
  }, [guesses, riddle, riddleGroup, gameEnded, CountdownTimerEnded]);

  useEffect(() => {
    if (gameEnded && !timerWasClosed)
      fetchAndStoreAllStats(riddleGroup, setStats);
  }, [riddleGroup, gameEnded, gameStatus, timerWasClosed]);

  function setNewAnswer(currSquare, key) {
    const newAns = currAnswer.slice();
    newAns[currSquare] = key;
    setCurrAnswer(newAns);
  }

  function onEnterClicked() {
    const newGuesses = [...guesses, currAnswer];
    const newStatus = getGameStatus(riddle, newGuesses);

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
      group_id: isMultiRiddle ? riddleGroup.id : null,
      seconds_left_on_timer: isMultiRiddle
        ? calcTimeLeft(timerStartTime)
        : null,
      was_logged_in: isLoggedIn,
    };
    const response = insertStats(body);
    await response;
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
      const isValidHebrew =
        arraysAreEqual(currAnswer, solution) ||
        (await areWordsValid([...currAnswer].reverse()));
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
            userStats={stats.userStats}
            login={login}
          />
        )}
        {viewStatus === VIEWS.howToPlayRules && (
          <HowToPlayRules
            closeModal={() => setViewStatus(VIEWS.game)}
            isLoggedIn={isLoggedIn}
            login={login}
          />
        )}

        <RiddleAndSquares
          riddle={riddle}
          gameEnded={gameEnded}
          gameStatus={gameStatus}
          currAnswer={currAnswer}
          guesses={guesses}
          handleKeyDown={handleKeyDown}
          isMultiRiddle={isMultiRiddle}
        />
        {isMultiRiddle && (
          <>
            <CountdownTimer
              key={riddleGroup.id}
              timerStartTime={timerStartTime}
              textToShow={calcEndOfGameText(
                CountdownTimerEnded,
                gameEnded,
                getNumRiddlesLeft(riddle.id, riddleGroup.group)
              )}
              setCounDownTimerEnded={setCounDownTimerEnded}
              gameEnded={gameEnded}
              timeEnded={CountdownTimerEnded}
            />
            <RiddlesResults
              riddleGroup={riddleGroup}
              currRiddle={riddle}
              setRiddle={(riddle) => {
                setRiddle(riddle);
                setTimerWasClosed(true);
              }}
              gameEnded={gameEnded}
              results = {getRiddlesResults(riddleGroup)}
            />
          </>
        )}
        <div className="tooltip-container">
          {invalidWordMessage && (
            <div dir="rtl" className="tooltip">
              נא להכניס מילה בעברית!
            </div>
          )}
        </div>

        <MyKeyBoard handleKeyDown={handleKeyDown} buttonTheme={keyBoardThem} />

        {showEndOfGameForm() ? (
          <EndOfGameForm
            onClose={() => setTimerWasClosed(true)}
            riddle={riddle}
            userDetails={userDetails}
            riddleGroup={riddleGroup}
            isWinner={isWinner}
            allStats={stats}
          />
        ) : null}
        <SocialIcons
          watsAppMessage={getWhatsAppMessage(isLoggedIn, isWinner)}
        />
      </div>
    </>
  );
}
