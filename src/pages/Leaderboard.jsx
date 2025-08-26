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

  const sortBy = (key, ascending = false) =>
    [...formatUsers].sort((a, b) =>
      ascending ? a[key] - b[key] : b[key] - a[key]
    );

  const sortConnections = () =>
    [...formatUsers].sort((a, b) => {
      if (a.completedConnections && !b.completedConnections) return -1;
      if (!a.completedConnections && b.completedConnections) return 1;
      return b.connectionsAttempts - a.connectionsAttempts;
    });

  const sortWordle = () =>
    [...formatUsers].sort((a, b) => {
      if (a.completedWordle && !b.completedWordle) return -1;
      if (!a.completedWordle && b.completedWordle) return 1;
      return a.wordleGuesses - b.wordleGuesses;
    });

  const getStatusEmoji = (index) => {
    if (index === 0) return "👑";
    if (index === 1) return "😍";
    if (index === 2) return "🫡";
    return "🥺👉👈";
  };

  const getConnectionsEmoji = (index) => {
    if (index === 4) return "👑";
    if (index === 3) return "💁";
    if (index === 2) return "🤷";
    if (index === 1) return "🙇";
    if (index === 0) return "🤦";
  };

  const checkConnectionsStatus = (index) => {
    if (index == 0) {
      return "Next time...";
    } else {
      return index;
    }
  };

  const getWordleEmoji = (index) => {
    if (index === 1) return "🫅";
    if (index === 2) return "🥳";
    if (index === 3) return "😅";
    if (index === 4) return "🥲";
    if (index === 5) return "🫣";
    if (index === 6) return "😱";
    if (index === 7) return "💀";
  };

  const checkWordleStatus = (index) => {
    if (index == 7) {
      return "Next time...";
    } else {
      return index;
    }
  };

  return (
    <div className="leaderboard-container">
      {/* Messages Leaderboard */}
      <div className="leaderboard-section">
        <h2>Messages</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Messages</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("messagesAdded").map((user, index) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.messagesAdded}</td>
                <td>{getStatusEmoji(index)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pictures Leaderboard */}
      <div className="leaderboard-section">
        <h2>Pictures</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Pictures</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortBy("picturesAdded").map((user, index) => (
              <tr key={user.uuid}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.picturesAdded}</td>
                <td>{getStatusEmoji(index)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Connections Leaderboard */}
      <div className="leaderboard-section">
        <h2>Connections</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Connection Attempts</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortConnections().map((user) => (
              <tr
                key={user.uuid}
                className={!user.completedConnections ? "in-progress" : ""}
              >
                <td>
                  {user.firstName} {user.lastName}
                </td>
                {user.completedConnections ? (
                  <td>{checkConnectionsStatus(user.connectionsAttempts)}</td>
                ) : (
                  <td>In progress...</td>
                )}
                {user.completedConnections ? (
                  <td>{getConnectionsEmoji(user.connectionsAttempts)}</td>
                ) : (
                  <td>🤔</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Wordle Leaderboard */}
      <div className="leaderboard-section">
        <h2>Wordle Guesses</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Guess Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortWordle().map((user) => (
              <tr
                key={user.uuid}
                className={!user.completedWordle ? "in-progress" : ""}
              >
                <td>
                  {user.firstName} {user.lastName}
                </td>
                {user.completedWordle ? (
                  <td>{checkWordleStatus(user.wordleGuesses)}</td>
                ) : (
                  <td>In progress...</td>
                )}

                {user.completedWordle ? (
                  <td>{getWordleEmoji(user.wordleGuesses)}</td>
                ) : (
                  <td>🤔</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
