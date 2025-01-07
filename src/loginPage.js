import { LOGINSTATUS } from "./Consts";
import { setUserData, setUserStats } from "./localStorageUtils";
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

export const onLoginSuccess = async (setLoginStatus, tokenResponse) => {
  const userInfo = await fetchUserInfo(tokenResponse.access_token);
  const stats = await fetchStats(userInfo.email);
  setUserData(userInfo);
  setLoginStatus(LOGINSTATUS.user);
  setUserStats(stats);
};

export const setGuestUser = (setLoginStatus) => {
  const now = Date.now();
  setUserData({ email: LOGINSTATUS.guest, name: now });
  setLoginStatus(LOGINSTATUS.guest);
};
