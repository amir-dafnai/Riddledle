import React from "react";
import { FiBarChart2 } from "react-icons/fi"; // Import icons
import { TfiWrite } from "react-icons/tfi";
import { IoIosLogIn } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";

import "./Navbar.css";
import { isUserLoggedIn, onLoginSuccess } from "./loginPage";
import { useGoogleLogin } from "@react-oauth/google";

const Navbar = ({ setLoginStatus, setShowForm }) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setLoginStatus, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Riddledle</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <button
            disabled={!isUserLoggedIn()}
            onClick={() => setShowForm(true)}
          >
            <TfiWrite size={24} /> {/* Play Icon */}
          </button>
        </li>
        <li>
          <button onClick={() => alert("Statistics clicked")}>
            <FiBarChart2 size={24} /> {/* Statistics Icon */}
          </button>
        </li>
        <li>
          <button onClick={() => alert("How to play")}>
            <FaRegQuestionCircle size={24} /> {/* How to play */}
          </button>
        </li>
        {!isUserLoggedIn() ? (
          <li>
            <button onClick={login}>
              <IoIosLogIn size={24} /> {/* Login Icon */}
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default Navbar;
