import {
  getNextSquareHebew,
  getNextSquareEnglish,
  getPrevSquareEnglish,
  getPrevSquareHebrew,
} from "./appUtils";
import { getRandomEnglishRiddle, getRandomHebrewRiddle } from "./riddlesStack";

export const LANG = "heb";
export const isHeb = LANG === "heb";
export const getRiddle = isHeb ? getRandomHebrewRiddle : getRandomEnglishRiddle;
export const getNextSquare = isHeb ? getNextSquareHebew : getNextSquareEnglish;
export const getPrevSquare = isHeb ? getPrevSquareHebrew : getPrevSquareEnglish;

export const isValidLetter = (value, isLastLetter) => {
  if (isHeb)
    return (
      "אבגדהוזחטיכלמנסעפצקרשת".indexOf(value) !== -1 ||
      ("םןףךץ".indexOf(value) !== -1 && isLastLetter)
    );
  else return "abcdefghijklmnopqrstuvwxyz".indexOf(value.toLowerCase()) !== -1;
};

export const getGameLostH1Text = (solution) => {
  if (isHeb) {
    const solText = [...solution].reverse().join("");
    return `לא נורא... הפתרון הנכון הוא ${solText} `;
  } else return `Too bad... The solution was ${solution.join("")}`;
};

export const convertLastLetter = (val) => {
  switch (val) {
    case "צ":
      return "ץ";
    case "פ":
      return "ף";
    case "מ":
      return "ם";
    case "נ":
      return "ן";
    case "כ":
      return "ך";
    default:
      return val
  }
};
