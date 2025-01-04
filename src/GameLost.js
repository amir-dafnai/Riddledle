import { NextRiddleButton } from "./NextRiddleButton";
import { textDirection } from "./appUtils";

export function GameLost({ solution, handleClick }) {
  return (
    <>
      <h1 className={textDirection}>{getGameLostH1Text(solution)}</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
export const getGameLostH1Text = (solution) => {
  const solText = [...solution].reverse().join("");
  return `לא נורא... הפתרון הנכון הוא ${solText} `;
};
