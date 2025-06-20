import { GAMESTATUS } from "./Consts";
import { getGameStatus } from "./Game";
import { getProgress } from "./localStorageUtils";

const getCurrRiddleIndex = (riddleID, riddles) => {
  return riddles.map((elem) => elem.id).indexOf(riddleID);
};

export const getNextRiddle = (currRiddle, riddles) => {
  const currIndex = getCurrRiddleIndex(currRiddle.id, riddles);
  const nextIndex = currIndex + 1 < riddles.length ? currIndex + 1 : null;
  return nextIndex ? riddles[nextIndex] : null;
};

export const getPrevRiddle = (currRiddle, riddles) => {
  const currIndex = getCurrRiddleIndex(currRiddle.id, riddles);
  const prevIndex = currIndex - 1 >= 0 ? currIndex - 1 : null;
  return prevIndex ? riddles[prevIndex] : null;
};

export const isLastRiddle = (currRiddle, riddles) => {
  const isLast = riddles.at(-1).id === currRiddle.id;
  return isLast;
};

export const wonAll = (riddleGroup, numberOfGuesses=4) => {
  for (const riddle of riddleGroup.group){
    const riddleProgress= getProgress()[riddle.id]
    if(!riddleProgress) return false
    if (
      getGameStatus(riddle,  riddleProgress.guesses, numberOfGuesses) !==
      GAMESTATUS.win
    ){
      
      return false;
    }
  }
  return true;
  
};

export const failedAny = (riddleGroup, numberOfGuesses=4) => {
  for (const riddle of riddleGroup.group){
    const riddleProgress= getProgress()[riddle.id]
    if(!riddleProgress) return false
    if (
      getGameStatus(riddle,  riddleProgress.guesses, numberOfGuesses) ===
      GAMESTATUS.lose
    ){
      return true;
    }
  }
  return false;
  
};
