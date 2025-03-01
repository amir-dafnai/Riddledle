import { GAMESTATUS } from "../Consts";

export const Top = ({ word, gameStatus }) => {
    const text = gameStatus === GAMESTATUS.win ? "הצלחת!" : "לא נורא...";
    return (
      <>
        {" "}
        {/* Header Section */}
        <h2 className="win-message" dir="rtl">
          {text}
        </h2>
        <div className="word-display">
          {word.map((letter, index) => (
            <div
              key={index}
              className={`${letter !== " " ? "letter-tile" : "invisible-tile"} ${
                letter !== " " ? "green-tile" : ""
              }`}
            >
              {letter}
            </div>
          ))}
        </div>
      </>
    );
  };