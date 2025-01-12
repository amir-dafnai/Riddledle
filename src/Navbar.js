import React from "react";
import { FiBarChart2 } from "react-icons/fi"; // Import icons
import { TfiWrite } from "react-icons/tfi";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import "./Navbar.css";
import { logOut, onLoginSuccess } from "./loginPage";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VIEWS } from "./Consts";
import "./howToPlay.css";

const HowToPlayRules = ({ closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>
          X
        </button>
        <h2>איך משחקים</h2>
        <p>
          לפניכם ארבעה נסיונות לפתור את חידת ההגיון. 
          לאחר כל ניחוש ייצבעו האותיות בצבעים ירוק כתום או אפור בהתאם למיקומן בפתרון החידה.
          אפור - האות לא נמצאת בכלל בפתרון
          כתום - האות נמצאת בפתרון אך במקום אחר
          ירוק - האות נמצאת בפתרון באותו מקום
        
        </p>
      </div>
    </div>
  );
};

const HowToPlayLogic = ({ closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeModal}>
          X
        </button>
        <h2>Tips and Tricks</h2>
        <p>
          1. Start with a word that has many vowels. <br />
          2. Use process of elimination to narrow down the letters. <br />
          3. Pay attention to repeated letters in the solution.
        </p>
      </div>
    </div>
  );
};

const showMustLoginToast = () => {
  toast.warn("Must be logged in", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const Navbar = ({ isLoggedIn, setUserDetails, setViewStatus, viewStatus }) => {
  const closeModal = () => setViewStatus(VIEWS.game);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setUserDetails, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <>
      <div>
        <ToastContainer theme="dark" />
        <nav className="navbar">
          <div className="navbar-logo">
            <h1>Riddledle</h1>
          </div>
          <ul className="navbar-links">
            <li>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    showMustLoginToast();
                  } else setViewStatus(VIEWS.form);
                }}
              >
                <TfiWrite size={24} /> {/* Suggest riddle */}
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    showMustLoginToast();
                  } else {
                    setViewStatus(VIEWS.stats);
                  }
                }}
              >
                <FiBarChart2 size={24} /> {/* Statistics Icon */}
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  setViewStatus((oldVal) =>
                    oldVal === VIEWS.howToPLay ? VIEWS.game : VIEWS.howToPLay
                  )
                }
              >
                <FaRegQuestionCircle size={24} /> {/* How to play */}
              </button>
              {viewStatus === VIEWS.howToPLay && (
                <div className="help-menu">
                  <ul>
                    <li onClick={() => setViewStatus(VIEWS.howToPlayRules)}>
                      איך משחקים
                    </li>
                    <li onClick={() => setViewStatus(VIEWS.howToPlayLogic)}>
                      חוקי חידות היגיון
                    </li>
                  </ul>
                </div>
              )}
            </li>
            {!isLoggedIn ? (
              <li>
                <button onClick={login}>
                  <IoIosLogIn size={24} /> {/* Login Icon */}
                </button>
              </li>
            ) : (
              <button
                onClick={() => {
                  logOut(setUserDetails);
                }}
              >
                <IoIosLogOut size={24} /> {/* LogOut Icon */}
              </button>
            )}
          </ul>
        </nav>
      </div>
      {viewStatus === VIEWS.howToPlayRules && (
        <HowToPlayRules closeModal={closeModal} />
      )}
      {viewStatus === VIEWS.howToPlayLogic && (
        <HowToPlayLogic closeModal={closeModal} />
      )}
    </>
  );
};

export default Navbar;
