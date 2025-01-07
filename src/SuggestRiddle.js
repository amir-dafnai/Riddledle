import { getUserData } from "./localStorageUtils";
import { getUrl } from "./appUtils";

export const SuggestRiddleForm = ({ setShowForm }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const definition = formData.get("definition");
    const solution = formData.get("solution");
    const userData = getUserData();
    const user_name = userData.name;
    const email = userData.email;
    fetch(`${getUrl()}api/create_new_riddle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ definition, solution, user_name, email }),
    });

    setShowForm(false);
  };


  return (
    <>
      <div className="overlay">
        <form
          onSubmit={handleSubmit}
          className="form-container rtl-form dark-mode"
        >
          <h2 className="form-title">הצעת חידה חדשה</h2>
          <label>
            <span className="label-text">הגדרה:</span>
            <input
              type="text"
              name="definition"
              maxLength="100"
              placeholder="הקלד את ההגדרה כאן"
              required
            />
          </label>
          <label>
            <span className="label-text">פתרון:</span>
            <input
              type="text"
              name="solution"
              maxLength="100"
              placeholder="הקלד את הפתרון כאן"
              required
            />
          </label>
          <div className="button-container">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="cancel-button"
            >
              ביטול
            </button>
            <button type="submit" className="submit-button">
              שליחה
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
