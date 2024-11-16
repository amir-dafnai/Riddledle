import {
  getNextSquareHebew,
  getNextSquareEnglish,
  getPrevSquareEnglish,
  getPrevSquareHebrew,
} from "./appUtils";
import { getRandomEnglishRiddle, getRandomHebrewRiddle } from "./riddlesStack";

export const LANG = "eng";
export const getRiddle =
  LANG === "heb" ? getRandomHebrewRiddle : getRandomEnglishRiddle;
export const getNextSquare =
  LANG === "heb" ? getNextSquareHebew : getNextSquareEnglish;
export const getPrevSquare =
  LANG === "heb" ? getPrevSquareHebrew : getPrevSquareEnglish;

export const isValidLetter = (value) =>{
  if(LANG === "heb") return "אבגדהוזחטיכלמנסעפצקרשתךםןףץ".indexOf(value) !== -1
  else return "abcdefghijklmnopqrstuvwxyz".indexOf(value.toLowerCase()) !== -1
}