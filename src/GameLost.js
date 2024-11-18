import { NextRiddleButton } from "./App";
import { getGameLostH1Text } from "./LANG";
import {textDirection} from "./appUtils"



export function GameLost({ solution, handleClick }) {
  return (
    <>
      <h1 className={textDirection}>{getGameLostH1Text(solution)}</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
