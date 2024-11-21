import { NextRiddleButton } from "./NextRiddleButton";

export function GameWon({ handleClick }) {
  return (
    <>
      <h1>You Got It!</h1>
      <NextRiddleButton handleClick={handleClick} />
    </>
  );
}
