import React from "react";
import "./WelcomeModal.css";

const WelcomeHeadline = ({isMultiRiddle}) => {
  const multiRiddleheadline1 = "האתגר השבועי!";
  const multiReadleHeadline2 = "נסו לפתור חמש חידות בדקה";
  const headLineText = !isMultiRiddle ? "יאללה חידה חדשה! 🎉" : multiRiddleheadline1;

  return (
    <>
      <h2 dir="rtl"> {headLineText} </h2>
      {isMultiRiddle && <h3>{multiReadleHeadline2}</h3>}
    </>
  );
};

export const WelcomeModal = ({
  onClose,
  isLoggedIn,
  login,
  onHowToPLay,
  isMultiRiddle,
}) => {
  const continueButtonText = isLoggedIn
    ? "המשך לחידה!"
    : !isMultiRiddle
    ? "המשך כאורח"
    : "חייבים להתחבר כדי לשחק היום";
  const loginText = !isMultiRiddle ? "כדאי להתחבר כדי להיות חלק מהתחרות!" : "";
  const canPlay = !isMultiRiddle || isLoggedIn;
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <h1 className="unclickable">Riddledle</h1>
        <WelcomeHeadline isMultiRiddle={isMultiRiddle}/>
        <button dir="rtl" className="how-to-play-button" onClick={onHowToPLay}>
          איך משחקים?
        </button>

        {!isLoggedIn && (
          <div dir="rtl" className="login-section">
            <p dir="rtl" className="login-hint">
              {loginText}
            </p>
            <span className="login-link" onClick={login}>
              להתחברות
            </span>
          </div>
        )}
        {
          <button
            className="continue-button"
            dir="rtl"
            onClick={onClose}
            disabled={!canPlay}
          >
            {continueButtonText}
          </button>
        }
      </div>
    </div>
  );
};
