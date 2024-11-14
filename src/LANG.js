import {
  getNextSquareHebew,
  getNextSquareEnglish,
  getPrevSquareEnglish,
  getPrevSquareHebrew,
} from "./appUtils";
import { getRandomEnglishRiddle, getRandomHebrewRiddle } from "./riddlesStack";

export const LANG = "ENG";
export const getRiddle =
  LANG === "HEB" ? getRandomHebrewRiddle : getRandomEnglishRiddle;
export const getNextSquare =
  LANG === "HEB" ? getNextSquareHebew : getNextSquareEnglish;
export const getPrevSquare =
  LANG === "HEB" ? getPrevSquareHebrew : getPrevSquareEnglish;

export const isValidLetter = (value) =>{
  if(LANG === "HEB") return "אבגדהוזחטיכלמנסעפצקרשתךםןףץ".indexOf(value) !== -1
  else return "abcdefghijklmnopqrstuvwxyz".indexOf(value.toLowerCase()) !== -1
}