import { useState } from "react";
import { getUserData } from "./localStorageUtils";
import { getUrl } from "./appUtils";

export const UseForm = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const definition = formData.get("definition");
    const solution = formData.get("solution");
    const userData = getUserData();
    const user_name = userData.name;
    const email = userData.email;
    console.log({ definition, solution, user_name, email });
    fetch(`${getUrl()}api/create_new_riddle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ definition, solution, user_name, email }),
    });

    setShowForm(false);
  };

  return [showForm, setShowForm, handleSubmit];
};

export const SuggestRiddleForm = ({ setShowForm, handleSubmit }) => {
  return (
    <>
      (
      <div className="overlay">
        <form onSubmit={handleSubmit} className="form-container">
          <label>
            Definition:
            <input type="text" name="definition" required />
          </label>
          <label>
            Solution:
            <input type="text" name="solution" required />
          </label>
          <div className="button-container">
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      )
    </>
  );
};
