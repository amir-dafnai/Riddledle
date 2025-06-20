export const storeProgress = (progress) => {
  localStorage.setItem("progress", JSON.stringify(progress));
};
export const getProgress = () => {
  return JSON.parse(localStorage.getItem("progress") || "{}");
};

export const storeUserData = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};
export const getUserData = () => {
  return "user" in localStorage
    ? JSON.parse(localStorage.getItem("user"))
    : null;
};

export const storeUserStats = (stats) => {
  localStorage.setItem("stats", JSON.stringify(stats));
};

export const getUserStats = () => {
  return "stats" in localStorage && localStorage.getItem("stats") !== "{}"
    ? JSON.parse(localStorage.getItem("stats"))
    : null;
};

export const getLeaderBoardStats = () => {
  return "leaderboard" in localStorage && localStorage.getItem("leaderboard") !== "{}"
  ? JSON.parse(localStorage.getItem("leaderboard"))
  : null;
};

export const storeLeaderBoardStats = (leaderBoardStats) => {
  localStorage.setItem("leaderboard", JSON.stringify(leaderBoardStats));
};

