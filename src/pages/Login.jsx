import { useState } from "react";
import { supabase } from "../SupabaseClient";

const Login = ({ setUserData }) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = (e) => {
    const uuid = crypto.randomUUID();

    e.preventDefault();
    setUserData({ first: firstName, last: lastName, userId: uuid });

    addUser("users", { first: firstName, last: lastName, userId: uuid });
  };

  async function addUser(tableName, data) {
    const { error } = await supabase.from(tableName).insert({
      firstName: data.first,
      lastName: data.last,
      uuid: data.userId,
      connectionsAttempts: 4,
    });

    if (error) {
      console.error(error.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Let the party begin!</h1>

        <h3>
          Please provide your information to get details about the wedding, play
          mini games, and upload pictures throughout the night.
        </h3>
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
