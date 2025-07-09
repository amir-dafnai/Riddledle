import React from "react";
import { FiBarChart2 } from "react-icons/fi"; // Import icons
import { TfiWrite } from "react-icons/tfi";
import { FaRegQuestionCircle } from "react-icons/fa";

import "./Navbar.css";
import { logOut } from "./loginPage";

import { VIEWS } from "./Consts";



const StatsButton = ({ onclick }) => {
  return (
    <li>
      <button onClick={onclick}>
        <FiBarChart2 size={24} /> {/* Statistics Icon */}
      </button>
    </li>
  );
};



const Navbar = ({
  isLoggedIn,
  login,
  setUserDetails,
  setViewStatus,
  viewStatus,
  isMultiRiddle,
}) => {
  return (
    <>
      <div>
        <nav className="navbar unselectable">
          <div className="navbar-logo">
            <h1 className="unclickable">Riddledle</h1>
          </div>
          <ul className="navbar-links">
            <li>
              <button
                onClick={() => {
                  setViewStatus(VIEWS.form);
                }}
              >
                <TfiWrite size={24} /> {/* Suggest riddle */}
              </button>
            </li>
            <StatsButton onclick={() => setViewStatus(VIEWS.stats)} />

            <li>
              <button
                onClick={() =>
                  setViewStatus((oldVal) =>
                    oldVal === VIEWS.howToPlayRules
                      ? VIEWS.game
                      : VIEWS.howToPlayRules
                  )
                }
              >
                <FaRegQuestionCircle size={24} /> {/* How to play */}
              </button>
            </li>
            {!isLoggedIn ? (
              <button
                className="unselectable"
                onClick={login}
                disabled={viewStatus !== VIEWS.game}
              >
                התחבר
              </button>
            ) : (
              !isMultiRiddle && (
                <button
                  className="unselectable"
                  disabled={viewStatus !== VIEWS.game}
                  onClick={() => {
                    logOut(setUserDetails);
                  }}
                >
                  התנתק
                </button>
              )
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
