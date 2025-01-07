import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { getUserData, setUserData } from "./localStorageUtils";

export const isUserLoggedIn = () => {
  return getUserData().email !== "guest";
};

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
  setUserData(userInfo);
  setLoginStatus("user");
};

export const CustomGoogleLogin = ({ setLoginStatus }) => {

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setLoginStatus, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <>
      <button className="google-login-button" onClick={login}>
        <span>Sign in with Google</span>
      </button>
    </>
  );
};

export const GoogleLoginOrGuest = ({ setLoginStatus }) => {
  const asGuest = () => {
    const now = Date.now();
    setUserData({ email: "guest", name: now });
    setLoginStatus("guest");
  };
  return (
    <>
      <CustomGoogleLogin setLoginStatus={setLoginStatus} />
      <button className="google-login-button" onClick={asGuest}>
        <span>Continue As Guest</span>
      </button>
    </>
  );
};
