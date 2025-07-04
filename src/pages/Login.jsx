import { useState } from "react";

const Login = ({ setName }) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  return (
    <div>
      <h1>Hello! Welcome to the wedding. </h1>
      <h3>Please provide your information below.</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ paddingTop: "5px" }}>
          <label for="firstName"> First name:</label>
          <input
            style={{ margin: "5px" }}
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            required
          />
        </div>
        <div style={{ padding: "5px" }}>
          <label for="lastName"> Last name:</label>
          <input
            style={{ margin: "5px" }}
            type="text"
            id="lastName"
            value={lastName}
            placeholder="Optional..."
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <button
          style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}
          onClick={() => setName(firstName)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login;
