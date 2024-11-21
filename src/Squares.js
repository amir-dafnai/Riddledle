import { useEffect } from "react";

function Square({ value, style }) {
  const color = style && style.backgroundColor;
  return <div className={`square ${color} pop`}>{value}</div>;
}
function InvisibleSquare() {
  return <div className="invisibleSquare"> </div>;
}

export function RowOfSquares({ nSquares, currGuess, styles, handleKeyDown }) {
  useEffect(() => {
    if (handleKeyDown == null) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const squaresRow = [];
  for (let i = 0; i < nSquares; i++) {
    if (currGuess[i] !== " ") {
      squaresRow.push(
        <Square key={i} value={currGuess[i]} style={styles[i]}></Square>
      );
    } else squaresRow.push(<InvisibleSquare key={i}> </InvisibleSquare>);
  }
  return squaresRow;
}
