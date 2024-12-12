import { useEffect, useState } from "react";
import { UseRiddleForm, UserRiddleForm } from "./UserRiddleForm";

import {
  getEmptyAnswer,
  arraysAreEqual,
  textDirection,
  getLastLetterIndices,
  getStringLengths,
  get_url,
} from "./appUtils";
import { setProgress, getProgress, getUserData } from "./localStorageUtils";
import { GameLost } from "./GameLost";
import {
  getPrevSquare,
  getNextSquare,
  isValidLetter,
  convertToLastLetter,
} from "./LANG";
import { GameWon } from "./GameWon";
import { Riddle } from "./Riddle";

const getGameStatus = (solution, guesses, numberOfGuesses) => {
  const currGuess = guesses.length;
  const status = arraysAreEqual(solution, guesses[guesses.length - 1])
    ? "win"
    : currGuess === numberOfGuesses
    ? "lose"
    : "playing";
  return status;
};

export function Game({ riddle, reset }) {
  const progress = getProgress();

  const [showForm, setShowForm, handleSubmit] = UseRiddleForm();
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

  function onEnterClicked() {
    const newGuesses = [...guesses, currAnswer];
    const newStatus = getGameStatus(solution, newGuesses, numberOfGuesses);
    if (newStatus !== "playing") {
      storeStats(newGuesses, newStatus);
    }
    setGuesses(newGuesses);
    setCurrAnswer(getEmptyAnswer(solution));
  }

  function storeStats(newGuesses, newStatus) {
    const guessesAsStrings = newGuesses.map((ans) =>
      [...ans].reverse().join("")
    );
    console.log('sending ' , getUserData())

    const url = get_url();
    const userData = getUserData()
    fetch(`${url}api/insert_stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        riddle_id: riddle.id,
        status: newStatus,
        guesses: guessesAsStrings,
        user_name : userData.name,
        email : userData.email  
      }),
    });
  }

  function handleKeyDown(event) {
    if (gameStatus !== "playing" || showForm) return;
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
      {/* <button onClick={()=>setShowForm(true)}>Suggest Your Own</button> */}
      <div className="riddle-container">
        {showForm && (
          <UserRiddleForm
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
          />
        )}
        <h1 className={textDirection}>
          {riddle.definition} {getStringLengths(riddle.solution)}
        </h1>
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
