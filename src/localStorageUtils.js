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


export const storeGlobalStats = (stats) => {
  localStorage.setItem("globalStats", JSON.stringify(stats));
}


export const getGlobalStats = () => {
  return "globalStats" in localStorage && localStorage.getItem("globalStats") !== "{}"
    ? JSON.parse(localStorage.getItem("globalStats"))
    : null;
};

export const storeAllTimeWinners = (winners) =>{
  localStorage.setItem("allTimeWinners", JSON.stringify(winners));
}

export const getAllTimeWinners = () => {
  return "allTimeWinners" in localStorage && localStorage.getItem("allTimeWinners") !== "{}"
    ? JSON.parse(localStorage.getItem("allTimeWinners"))
    : null;
};

export const storeWeeklyWinners = (winners) => {
  localStorage.setItem("weeklyWinners", JSON.stringify(winners))
}

export const getWeeklyWinners = () => {
  return "weeklyWinners" in localStorage && localStorage.getItem("weeklyWinners") !== "{}"
    ? JSON.parse(localStorage.getItem("weeklyWinners"))
    : null;
};

export const storePersonalScores = (scores) =>{
  localStorage.setItem("personalScores", JSON.stringify(scores))
}

export const getPersonalScores = () => {
  return "personalScores" in localStorage && localStorage.getItem("personalScores") !== "{}"
    ? JSON.parse(localStorage.getItem("personalScores"))
    : null;
};