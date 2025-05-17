import { useState } from "react";

const Login = ({ setName }) => {
  const [userName, setUserName] = useState("");
  return (
    <div>
      <h3>Name:</h3>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={() => setName(userName)}>Submit</button>
    </div>
  );
};

export default Login;
