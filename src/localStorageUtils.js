export const setProgress = (progress) => {
  localStorage.setItem("progress", JSON.stringify(progress));
};
export const getProgress = () => {
  return JSON.parse(localStorage.getItem("progress") || "{}");
};

export const setUserData = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};
export const getUserData = () => {
  return "user" in localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : null;
};

export const setUserStats = (stats) => {
  localStorage.setItem("stats", JSON.stringify(stats));
};

export const getUserStats = () => {
  return "stats" in localStorage && localStorage.getItem("stats") !== '{}'
    ? JSON.parse(localStorage.getItem("stats"))
    : null;
};
