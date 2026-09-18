export const VIEWS = {
  form: "form",
  game: "game",
  stats: "stats",
  howToPlayRules: "howToPlayRules",
  welcome: "welcome",
  howToPLayWelcome: "howToPLayWelcome",
};
export const GAMESTATUS = {
  win: "win",
  lose: "lose",
  playing: "playing",
};
export const AnimationDelay = 80;

export const NumberOfGuesses = 4;

// A riddle's language, as sent by the server on every riddle. Riddles saved
// before the server knew about languages have none, so Hebrew is the default
// everywhere this is read.
export const LANGUAGES = {
  hebrew: "he",
  english: "en",
};
