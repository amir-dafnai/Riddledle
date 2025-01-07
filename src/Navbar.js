import React from "react";
import { FiBarChart2 } from "react-icons/fi"; // Import icons
import { TfiWrite } from "react-icons/tfi";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import "./Navbar.css";
import { onLoginSuccess, setGuestUser } from "./loginPage";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VIEWS } from "./Consts";

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

const Navbar = ({ isLoggedIn, setLoginStatus, setViewStatus }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setLoginStatus, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
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
            <button onClick={() => alert("How to play")}>
              <FaRegQuestionCircle size={24} /> {/* How to play */}
            </button>
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
                setGuestUser(setLoginStatus);
              }}
            >
              <IoIosLogOut size={24} /> {/* LogOut Icon */}
            </button>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
