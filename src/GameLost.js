import { NextRiddleButton } from "./App";
import { LANG } from "./LANG";
import {textDirection} from "./appUtils"

function getGameLostH1Text(solution) {
  if (LANG === "ENG") return `Too bad... The solution was ${solution.join("")}`;
  else {
    const solText = [...solution].reverse().join("");
    return `לא נורא... הפתרון הנכון הוא ${solText} `;
  }
}

export function GameLost({ solution, handleClick }) {
  return (
    <>
      <h1 className={textDirection}>{getGameLostH1Text(solution)}</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
