import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { storeProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar from "./Navbar";
import { onLoginSuccess, setGuestUser } from "./loginPage";
import { VIEWS } from "./Consts";
import { ToastContainer } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { CreditModal } from "./UserCreditModal";

const riddlesAreEqual = (r1, r2) => {
  return r1.id === r2.id && r1.definition === r2.definition;
};

const useRiddle = () => {
  const [riddle, setRiddle] = useState(getProgress().riddle);
  useEffect(() => {
    const url = getUrl();
    const fetchData = async () => {
      const response = await fetch(`${url}get_riddle?&new=${riddle === null}`);
      const data = await response.json();
      if (riddle && riddle.startTime && riddlesAreEqual(riddle, data.riddle))
        return;
      data.riddle.startTime = Date.now();
      data.riddle.endTime = null;
      storeProgress({});
      setRiddle(data.riddle);
    };
    fetchData();
  }, [riddle]);

  return riddle
};

const App = () => {
  const riddle = useRiddle();
  const [userDetails, setUserDetails] = useState(null);
  const [viewStatus, setViewStatus] = useState(VIEWS.game);
  const [showCreditModal , setShowCreditModal] = useState(true)

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setUserDetails, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUserDetails(storedUser);
    } else {
      setGuestUser(setUserDetails);
    }
  }, []);

  if (userDetails && riddle) {
    return (
      <>
        <ToastContainer theme="dark" />
        <Navbar
          login={login}
          isLoggedIn={userDetails.loggedIn}
          setUserDetails={setUserDetails}
          setViewStatus={setViewStatus}
          viewStatus={viewStatus}
        />
        {showCreditModal && riddle.credit_email === userDetails.email && <CreditModal onClose = {() => setShowCreditModal(false)}/> }
        <Game
          key={`${riddle.id}-${userDetails.email}`}
          riddle={riddle}
          viewStatus={viewStatus}
          setViewStatus={setViewStatus}
          userDetails={userDetails}
          login={login}
        />
      </>
    );
  }
};
export default App;
