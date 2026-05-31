import React from "react";
import "./WelcomeModal.css";

const WelcomeHeadline = ({ isMultiRiddle }) => {
  const multiRiddleheadline1 = "האתגר השבועי!";
  const multiReadleHeadline2 = "!נסו לפתור חמש חידות בדקה";
  const headLineText = !isMultiRiddle
    ? "יאללה חידה חדשה!"
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
}) => {
  return (
    <div className="welcome-modal-overlay">
      <div className="welcome-modal">
        <h1 className="unclickable">Riddledle</h1>
        <WelcomeHeadline isMultiRiddle={isMultiRiddle} />
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
