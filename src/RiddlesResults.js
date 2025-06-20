// RiddleResults.js
import React from "react";
import "./RiddlesResults.css";
import { arraysAreEqual } from "./appUtils";
import { getProgress } from "./localStorageUtils";

const getRiddleStatus = (riddle, numberOfGuesses) => {
  const progress = getProgress()[riddle.id];
  if (!progress || !progress.guesses) return "pending";

  const guessed = progress.guesses;

  return arraysAreEqual(riddle.solution, guessed[guessed.length - 1])
    ? "win"
    : guessed.length === numberOfGuesses
    ? "lose"
    : "pending";
};

export const getRiddlesResults = (riddleGroup, numberOfGuesses) => {
  return riddleGroup.group.map((r) => getRiddleStatus(r, numberOfGuesses));
};

const getCircles = (results, currentIndex, onClick) => {
  return results
    .map((status, index) => {
      return (
        <div
          onClick={onClick ? () => onClick(index) : () => {}}
          key={index}
          className={`result-circle ${status} ${
            index === currentIndex ? "current" : ""
          }`}
          title={`Riddle ${index + 1}`}
        ></div>
      );
    })
    .reverse();
};

export const RiddlesResults = ({
  riddleGroup,
  currRiddle,
  numberOfGuesses,
  setRiddle,
  gameEnded,
}) => {
  const currentIndex = riddleGroup.group
    .map((r) => r.id)
    .indexOf(currRiddle.id);
  const results = getRiddlesResults(riddleGroup, numberOfGuesses);
  const onCircleClick = gameEnded
    ? (index) => setRiddle(riddleGroup.group[index])
    : null;
  return (
    <div className="riddle-results-wrapper">
      <div className="riddle-results-container">
        {getCircles(results, currentIndex, onCircleClick)}
      </div>
    </div>
  );
};
