import {
  getUserData,
  storeProgress,
  storeUserData,
  storeUserStats,
} from "./localStorageUtils";
import { fetchStats } from "./Stats";

const fetchUserInfo = async (accessToken) => {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};

export const onLoginSuccess = async (setUserInfo, tokenResponse) => {
  const userInfo = await fetchUserInfo(tokenResponse.access_token);
  const stats = await fetchStats(userInfo.email);
  const currStoredUser = getUserData();
  if (
    currStoredUser &&
    currStoredUser.email.includes("@") &&
    currStoredUser.email !== userInfo.email
  )
    storeProgress({});
  userInfo.loggedIn = true;
  storeUserData(userInfo);
  setUserInfo(userInfo);
  storeUserStats(stats);
};

export const setGuestUser = (setUserInfo) => {
  const now = Date.now();
  const userInfo = { email: now, name: now, loggedIn: false };
  storeUserData(userInfo);
  setUserInfo(userInfo);
};

export const logOut = (setUserInfo) => {
  const newUserInfo = { ...getUserData(), loggedIn: false };
  storeUserData(newUserInfo);
  setUserInfo(newUserInfo);
};
