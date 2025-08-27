import React, { useEffect, useState } from "react";
import { supabase } from "../SupabaseClient";
import "./Leaderboard.css";

import { ClipLoader } from "react-spinners";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);

      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
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

  const getBingoEmoji = (index) => {
    if (index == 12) return "👑";
    if (index == 11) return "😄";
    if (index == 10) return "😃";
    if (index == 9) return "🙂";
    if (index == 8) return "😐";
    if (index == 7) return "😕";
    if (index == 6) return "😟";
    if (index == 5) return "😢";
    if (index == 4) return "😥";
    if (index == 3) return "😓";
    if (index == 2) return "😞";
    if (index == 1) return "😔";
    if (index == 0) return "😭";
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
      return Math.abs(index - 4);
    }
  };

  const getWordleEmoji = (index) => {
    if (index === 1) return "👑";
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

  const getTopChampion = () => {
    if (!users.length) return null;

    const formatted = formatUsers;

    const topMessages = sortBy("messagesAdded")[0]?.uuid;
    const topPictures = sortBy("picturesAdded")[0]?.uuid;
    const topBingos = sortBy("totalBingos")[0]?.uuid;
    const topConnections = sortConnections()[0]?.uuid;
    const topWordle = sortWordle()[0]?.uuid;

    // Return the user if they are first in every leaderboard
    if (
      topMessages &&
      topPictures &&
      topBingos &&
      topConnections &&
      topWordle &&
      topMessages === topPictures &&
      topMessages === topBingos &&
      topMessages === topConnections &&
      topMessages === topWordle
    ) {
      return formatted.find((u) => u.uuid === topMessages);
    }

    return null;
  };

  const topChampion = getTopChampion();

  return (
    <>
      {loading ? (
        <ClipLoader
          color={"#5a86ad"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="leaderboard-container">
          {topChampion && (
            <div className="leaderboard-section">
              <div className="table-wrapper">
                <h2>🏆 King of games 🏆</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Messages</th>
                      <th>Pictures</th>
                      <th>Bingos</th>
                      <th>Connections Mistakes</th>
                      <th>Wordle Guesses</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        {topChampion.firstName} {topChampion.lastName}
                      </td>
                      <td>{topChampion.messagesAdded}</td>
                      <td>{topChampion.picturesAdded}</td>
                      <td>{topChampion.totalBingos}</td>
                      <td>{topChampion.connectionsAttempts}</td>
                      <td>{topChampion.wordleGuesses}</td>
                    </tr>
                  </tbody>
                </table>
                <img
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                    marginTop: "10px",
                  }}
                  src="https://static1.moviewebimages.com/wordpress/wp-content/uploads/2022/04/Yugioh-Poster-Resized.jpg"
                />
              </div>
            </div>
          )}

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

          <div className="leaderboard-section">
            <h2>Bingos</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pictures</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortBy("totalBingos").map((user) => (
                  <tr key={user.uuid}>
                    <td>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.totalBingos}</td>
                    <td>{getBingoEmoji(user.totalBingos)}</td>
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
                  <th>Mistakes Made</th>
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
                      <td>
                        {checkConnectionsStatus(user.connectionsAttempts)}
                      </td>
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
                  <th>Guesses</th>
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
      )}
    </>
  );
};

export default Leaderboard;
