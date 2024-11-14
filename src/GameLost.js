import { NextRiddleButton } from "./App";
import { LANG } from "./LANG";

function getGameLostH1Text(solution, lang) {
  if (lang === "ENG") return `Too bad... The solution was ${solution.join("")}`;
  else {
    const solText = [...solution].reverse().join("");
    return `לא נורא... הפתרון הנכון הוא ${solText} `;
  }
}

export function GameLost({ solution, handleClick }) {
  return (
    <>
      <h1>{getGameLostH1Text(solution, LANG)}</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
