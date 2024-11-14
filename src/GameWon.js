import { NextRiddleButton } from "./App";

export function GameWon({ handleClick }) {
  return (
    <>
      <h1>You Got It!</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
