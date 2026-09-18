import { render, screen } from "@testing-library/react";
import { RiddleAndSquares } from "./RiddleAndSquares";
import { MyKeyBoard } from "./KeyBoard";
import { WelcomeModal } from "./WelcomeModal";
import { getEmptyAnswer } from "./appUtils";
import { GAMESTATUS, LANGUAGES } from "./Consts";

const englishRiddle = {
  id: 900,
  definition: "What key?! Come inside!",
  solution: [..."ENTER"],
  language: LANGUAGES.english,
};

// A Hebrew riddle as the server sends it: the solution reversed into display order.
const hebrewRiddle = {
  id: 1,
  definition: "בירת צרפת",
  solution: [..."פריז"].reverse(),
  language: LANGUAGES.hebrew,
};

const renderBoard = (riddle, guesses = []) =>
  render(
    <RiddleAndSquares
      riddle={riddle}
      gameEnded={false}
      gameStatus={GAMESTATUS.playing}
      currAnswer={getEmptyAnswer(riddle.solution)}
      guesses={guesses}
      handleKeyDown={null}
      isMultiRiddle={false}
    />
  );

const squareText = (container) =>
  [...container.querySelectorAll(".square")].map((el) => el.textContent);

describe("english riddle rendering", () => {
  test("the definition is laid out left to right", () => {
    renderBoard(englishRiddle);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("dir", "ltr");
    expect(heading).toHaveClass("ltr-form");
    expect(heading.textContent).toContain("What key?! Come inside!");
  });

  test("a guess reads left to right on the board", () => {
    const { container } = renderBoard(englishRiddle, [[..."EATER"]]);
    expect(squareText(container).slice(0, 5)).toEqual(["E", "A", "T", "E", "R"]);
  });

  test("the hebrew board is still laid out right to left", () => {
    const { container } = renderBoard(hebrewRiddle, [[..."פריז"].reverse()]);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("dir", "rtl");
    // Display order: the last letter of the word sits in the leftmost square.
    expect(squareText(container).slice(0, 4)).toEqual(["ז", "י", "ר", "פ"]);
  });
});

describe("keyboard", () => {
  test("english shows a qwerty layout", () => {
    const { container } = render(
      <MyKeyBoard
        handleKeyDown={() => {}}
        buttonTheme={[]}
        language={LANGUAGES.english}
      />
    );
    const keys = [...container.querySelectorAll(".hg-button")].map(
      (el) => el.textContent
    );
    expect(keys.slice(0, 10)).toEqual([..."QWERTYUIOP"]);
    expect(keys).toContain("Z");
    expect(keys).not.toContain("ק");
    expect(keys).toContain("⌫");
    expect(keys).toContain("⏎");
  });

  test("hebrew keeps its own layout", () => {
    const { container } = render(
      <MyKeyBoard
        handleKeyDown={() => {}}
        buttonTheme={[]}
        language={LANGUAGES.hebrew}
      />
    );
    const keys = [...container.querySelectorAll(".hg-button")].map(
      (el) => el.textContent
    );
    expect(keys[0]).toBe("ק");
    expect(keys).not.toContain("Q");
  });
});

describe("welcome modal", () => {
  const renderWelcome = (language) =>
    render(
      <WelcomeModal
        onClose={() => {}}
        isLoggedIn={true}
        login={() => {}}
        onHowToPLay={() => {}}
        isMultiRiddle={false}
        language={language}
      />
    );

  test("english flags that the riddle is in english", () => {
    renderWelcome(LANGUAGES.english);
    expect(
      screen.getByText("יאללה חידה חדשה! (והפעם באנגלית 😎)")
    ).toBeInTheDocument();
  });

  test("hebrew keeps the plain headline", () => {
    renderWelcome(LANGUAGES.hebrew);
    expect(screen.getByText("יאללה חידה חדשה!")).toBeInTheDocument();
  });

  test("a riddle with no language keeps the plain headline", () => {
    renderWelcome(undefined);
    expect(screen.getByText("יאללה חידה חדשה!")).toBeInTheDocument();
  });
});
