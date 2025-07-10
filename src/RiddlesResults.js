// RiddleResults.js
import React from "react";
import "./RiddlesResults.css";
import { arraysAreEqual } from "./appUtils";
import { getProgress } from "./localStorageUtils";
import { NumberOfGuesses } from "./Consts";

const getRiddleStatus = (riddle) => {
  const progress = getProgress()[riddle.id];
  if (!progress || !progress.guesses) return "pending";

  const guessed = progress.guesses;

  return arraysAreEqual(riddle.solution, guessed[guessed.length - 1])
    ? "win"
    : guessed.length === NumberOfGuesses
    ? "lose"
    : "pending";
};

export const getRiddlesResults = (riddleGroup) => {
  return riddleGroup.group.map((r) => getRiddleStatus(r));
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
        ></div>
      );
    })
    .reverse();
};

export const RiddlesResults = ({
  riddleGroup,
  currRiddle,
  setRiddle,
  gameEnded,
  results,
}) => {
  const currentIndex = riddleGroup.group
    .map((r) => r.id)
    .indexOf(currRiddle.id);
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
