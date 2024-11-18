import {
  getNextSquareHebew,
  getNextSquareEnglish,
  getPrevSquareEnglish,
  getPrevSquareHebrew,
} from "./appUtils";
import { getRandomEnglishRiddle, getRandomHebrewRiddle } from "./riddlesStack";

export const LANG = "heb";
const isHeb = LANG === "heb"
export const getRiddle =
isHeb? getRandomHebrewRiddle : getRandomEnglishRiddle;
export const getNextSquare =
isHeb? getNextSquareHebew : getNextSquareEnglish;
export const getPrevSquare =
isHeb ? getPrevSquareHebrew : getPrevSquareEnglish;

export const isValidLetter = (value) => {
  if (isHeb)
    return "אבגדהוזחטיכלמנסעפצקרשתךםןףץ".indexOf(value) !== -1;
  else return "abcdefghijklmnopqrstuvwxyz".indexOf(value.toLowerCase()) !== -1;
};

export const getGameLostH1Text = (solution) => {
  if (isHeb) {
    const solText = [...solution].reverse().join("");
    return `לא נורא... הפתרון הנכון הוא ${solText} `;
  } else return `Too bad... The solution was ${solution.join("")}`;
};
