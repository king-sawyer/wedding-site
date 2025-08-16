import { useState } from "react";

const Login = ({ setUserData }) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ first: firstName, last: lastName });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Hello! Welcome to the wedding. </h1>
        <h3>Please provide your information below.</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ paddingTop: "5px" }}>
            <label>
              {" "}
              First name:
              <input
                style={{ margin: "5px" }}
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ padding: "5px" }}>
            <label>
              {" "}
              Last name:
              <input
                style={{ margin: "5px" }}
                type="text"
                id="lastName"
                value={lastName}
                placeholder="Optional..."
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </label>
          </div>

          <button
            type="submit"
            style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
