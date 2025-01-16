import { getUserData } from "./localStorageUtils";
import { getUrl } from "./appUtils";
import { VIEWS } from "./Consts";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";

const showSuccessToast = () => {
  toast.success("תודה! אולי החידה שלך תופיע כאן בקרוב ", {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const SuggestRiddleForm = ({ setViewStatus }) => {
  const definitionInputRef = useRef(null);

  useEffect(() => {
    if (definitionInputRef.current) {
      definitionInputRef.current.focus();
    }
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const definition = formData.get("definition");
    const solution = formData.get("solution");
    const userData = getUserData();
    const user_name = userData.name;
    const email = userData.email;
    await fetch(`${getUrl()}create_new_riddle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ definition, solution, user_name, email }),
    });
    showSuccessToast();
    setViewStatus(VIEWS.game);
  };

  return (
    <>
      <div className="overlay">
        <form
          onSubmit={handleSubmit}
          className="form-container rtl-form dark-mode"
        >
          <h2 className="form-title">
            הצעת חידה חדשה <br></br>
            <br></br>שלחו חידה משלכם ואולי היא תכנס למאגר!
          </h2>
          <label>
            <span className="label-text">הגדרה:</span>
            <input
              type="text"
              name="definition"
              maxLength="100"
              placeholder="הקלד את ההגדרה כאן"
              required
              ref={definitionInputRef}
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
              onClick={() => setViewStatus(VIEWS.game)}
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
