import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
    }
    fetchUserData();
  }, []);

  const formatUsers = users.map((user) => ({
    ...user,
    connectionsAttempts: parseInt(user.connectionsAttempts || 0, 10),
    messagesAdded: parseInt(user.messagesAdded || 0, 10),
    picturesAdded: parseInt(user.picturesAdded || 0, 10),
    wordleGuesses: JSON.parse(user.wordleGuesses || "[]").length,
    completedWordle: user.completedWordle,
    completedConnections: user.completedConnections,
  }));

  const sortBy = (key) => [...formatUsers].sort((a, b) => b[key] - a[key]);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-section">
        <h2>Messages</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Messages</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("messagesAdded").map((user) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.messagesAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-section">
        <h2>Pictures</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Pictures</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("picturesAdded").map((user) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.picturesAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-section">
        <h2>Connections</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Connection Attempts</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("connectionsAttempts").map((user) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                {user.completedConnections ? (
                  <td>{user.connectionsAttempts}</td>
                ) : (
                  <td> In progress...</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="leaderboard-section">
        <h2>Wordle Guesses</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Guess Count</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("wordleGuesses").map((user) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.wordleGuesses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
