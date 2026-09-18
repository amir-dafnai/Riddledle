import React from "react";
import { isEnglish } from "./language";
import "./WelcomeModal.css";

const WelcomeHeadline = ({ isMultiRiddle, language }) => {
  const multiRiddleheadline1 = "האתגר השבועי!";
  const multiReadleHeadline2 = "!נסו לפתור חמש חידות בדקה";
  // English riddles are rare enough to be worth calling out up front, so the
  // player isn't surprised by a Latin keyboard.
  const singleRiddleHeadline = isEnglish(language)
    ? "יאללה חידה חדשה! (והפעם באנגלית 😎)"
    : "יאללה חידה חדשה!";
  const headLineText = !isMultiRiddle
    ? singleRiddleHeadline
    : multiRiddleheadline1;

  return (
    <>
      <h2 dir="rtl"> {headLineText} </h2>
      {isMultiRiddle && <h3>{multiReadleHeadline2}</h3>}
    </>
  );
};

const HowToPLay = ({ onClick }) => {
  return (
    <button dir="rtl" className="how-to-play-button" onClick={onClick}>
      איך משחקים?
    </button>
  );
};

const LoginButton = ({ login }) => {
  return (
    <div className="button-container">
      <button className="action-button" onClick={login}>
        התחבר
      </button>
    </div>
  );
};

const ContinueButton = ({ onClose }) => {
  return (
    <div className="button-container">
      <button className="action-button" onClick={onClose}>
        המשך לחידה
      </button>
    </div>
  );
};

export const WelcomeModal = ({
  onClose,
  isLoggedIn,
  login,
  onHowToPLay,
  isMultiRiddle,
  language,
}) => {
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <h1 className="unclickable">Riddledle</h1>
        <WelcomeHeadline isMultiRiddle={isMultiRiddle} language={language} />
        {isLoggedIn ? (
          <ContinueButton onClose={onClose} />
        ) : (
          <LoginButton login={login} />
        )}

        <HowToPLay onClick={onHowToPLay} />
      </div>
    </div>
  );
};
