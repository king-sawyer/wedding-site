import "./welcomepage.css";

const Welcomepage = ({ logout, userData }) => {
  return (
    <div className="welcome-container">
      <h1>LET'S CELEBRATE!</h1>
      <h2>Hi {userData["first"]}, welcome to The King Wedding!</h2>
      <p>To access the site, use the menu button in the top left corner.</p>
      <h3>Be sure to try the following:</h3>
      <ul className="welcome-list">
        <li>Upload images throughout the night in the Photos tab</li>
        <li>Send us a message in the Messages tab</li>
        <li>See where you rank in the leaderboard</li>
        <li>Try the connections</li>
        <li>Try the wordle</li>
      </ul>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default Welcomepage;
