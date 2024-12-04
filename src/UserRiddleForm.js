import { useState } from "react";

export const UseRiddleForm = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const inputText = formData.get("inputField");
    console.log("User input:", inputText);

    // Handle form submission (e.g., send to the server)
    setShowForm(false); // Close the form after submission
  };

  return [showForm, setShowForm, handleSubmit];
};

export const UserRiddleForm = ({ setShowForm, handleSubmit }) => {
  return (
    <>
      (
      <div className="overlay">
        <form onSubmit={handleSubmit} className="form-container">
          <label>
            Definition:    
            <input type="text" name="text1" required />
          </label>
          <label>
            Solution: 
            <input type="text" name="text2" required />
          </label>
          <label>
            Your Name: 
            <input type="text" name="text3" required />
          </label>
          <div className="button-container">
            <button type="button" onClick={(()=>setShowForm(false))}>
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
