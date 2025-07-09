import { useGoogleLogin } from "@react-oauth/google";
import { onLoginSuccess, setGuestUser } from "./loginPage";
import { useEffect, useState } from "react";
import { getUserData } from "./localStorageUtils";

export const UseLogin = (setUserDetails) => {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await onLoginSuccess(setUserDetails, tokenResponse);
    },
    onError: () => {
      console.error("Login Failed");
    },
  });
  return login;
};

export const UseUserDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  useEffect(() => {
    const storedUser = getUserData();
    if (storedUser) {
      setUserDetails(storedUser);
    } else {
      setGuestUser(setUserDetails);
    }
  }, []);
  return [userDetails, setUserDetails];
};
