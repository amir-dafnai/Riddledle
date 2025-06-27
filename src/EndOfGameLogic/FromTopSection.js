
export const Top = ({ word, isWinner, isMultiRiddle }) => {
  const text = isWinner ? "הצלחת! 🎉" : "";
  return (
    <>
      {" "}
      {/* Header Section */}
      <h2 className="win-message" dir="rtl">
        {text}
      </h2>
      {!isMultiRiddle && (
        <div className="word-display">
          {word.map((letter, index) => (
            <div
              key={index}
              className={`${
                letter !== " " ? "letter-tile" : "invisible-tile"
              } ${letter !== " " ? "green-tile" : ""}`}
            >
              {letter}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
