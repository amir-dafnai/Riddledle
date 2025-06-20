import { useEffect } from "react";
import { AnimationDelay } from "./Consts";


function Square({ value, color, delay }) {

  
  return (
    <div
      className={`square ${color}  unselectable unclickable`}
      style={{ animationDelay: `${AnimationDelay * delay}ms` }}
    >
      {value}
    </div>
  );
}
function InvisibleSquare() {
  return <div className="invisibleSquare"> </div>;
}

export function RowOfSquares({ nSquares, currGuess, styles, handleKeyDown , gameEnded }) {
  useEffect(() => {
    if (handleKeyDown == null) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });
  const animationClass = gameEnded? ' no-animation' : ' animation'
  const styleClass = (i) => styles[i].backgroundColor + animationClass
  const squaresRow = [];
  for (let i = 0; i < nSquares; i++) {
    if (currGuess[i] !== " ") {
      squaresRow.push(
        <Square
          key={i}
          value={currGuess[i]}
          color={styleClass(i)}
          delay={nSquares - i}
        ></Square>
      );
    } else squaresRow.push(<InvisibleSquare key={i}> </InvisibleSquare>);
  }
  return squaresRow;
}
