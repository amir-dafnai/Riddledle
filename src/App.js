import { useEffect, useState } from "react";
import { getUrl } from "./appUtils";
import { storeProgress, getProgress, getUserData } from "./localStorageUtils";

import { Game } from "./Game";
import Navbar, { HowToPlayRules } from "./Navbar";
import { onLoginSuccess, setGuestUser } from "./loginPage";
import { VIEWS } from "./Consts";
import { useGoogleLogin } from "@react-oauth/google";
import { CreditModal } from "./UserCreditModal";
import { WelcomeModal } from "./WelcomeModal";

const riddlesAreEqual = (r1, r2) => {
  return r1.id === r2.id && r1.definition === r2.definition;
};

const App = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [viewStatus, setViewStatus] = useState(VIEWS.game);
  const [showCreditModal, setShowCreditModal] = useState(true);
  const [riddle, setRiddle] = useState(getProgress().riddle);
  const isUsersRiddle =
    riddle && userDetails && riddle.credit_email === userDetails.email;

  useEffect(() => {
    const fetchData = async () => {
      const url = getUrl();
      const response = await fetch(`${url}get_riddle?&new=${riddle === null}`);
      const data = await response.json();
      if (riddle && riddlesAreEqual(riddle, data.riddle)) return;
      data.riddle.endTime = null;
      storeProgress({});
      setRiddle(data.riddle);
      setViewStatus(VIEWS.welcome); // show modal on new riddle
    };
    fetchData();
  }, [riddle]);

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
    const passedWelcome =
      riddle.startTime &&
      ![VIEWS.welcome, VIEWS.howToPLayWelcome].includes(viewStatus);
    return (
      <>
        {passedWelcome && (
          <Navbar
            login={login}
            isLoggedIn={userDetails.loggedIn}
            setUserDetails={setUserDetails}
            setViewStatus={setViewStatus}
            viewStatus={viewStatus}
          />
        )}
        {!isUsersRiddle && viewStatus === VIEWS.welcome && (
          <WelcomeModal
            onClose={() => {
              setViewStatus(VIEWS.game);
              riddle.startTime = Date.now();
            }}
            login={login}
            onHowToPLay={() => setViewStatus(VIEWS.howToPLayWelcome)}
            isLoggedIn={userDetails.loggedIn}
          />
        )}
        {viewStatus === VIEWS.howToPLayWelcome && (
          <HowToPlayRules
            closeModal={() => setViewStatus(VIEWS.welcome)}
            isLoggedIn={userDetails.loggedIn}
            login={login}
          />
        )}
        {showCreditModal && isUsersRiddle && (
          <CreditModal
            onClose={() => {
              riddle.startTime = Date.now();
              setShowCreditModal(false);
              setViewStatus(VIEWS.game);
            }}
          />
        )}
        {passedWelcome && (
          <Game
            key={`${riddle.id}-${userDetails.email}`}
            riddle={riddle}
            viewStatus={viewStatus}
            setViewStatus={setViewStatus}
            userDetails={userDetails}
            login={login}
          />
        )}
      </>
    );
  }
};
export default App;
