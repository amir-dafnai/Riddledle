
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { setUserData } from "./localStorageUtils";


const fetchUserInfo = async (accessToken) => {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userInfo = await response.json();
    return userInfo
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null
  }
};



export const CustomGoogleLogin = ({ setIsLoggedIn  }) => {
const onLoginSuccess = async (tokenResponse) => {
        const userInfo = await fetchUserInfo(tokenResponse.access_token)
        setUserData(userInfo)
        setIsLoggedIn(true);
      };

      

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <button className="google-login-button" onClick={login}>
      <span>Sign in with Google</span>
    </button>
  );
};







