import "./welcomepage.css";

const Welcomepage = ({ logout, userData }) => {
  return (
    <div className="welcome-container">
      <h1>LETS CELEBRATE!</h1>
      <h2>HI {userData["first"]}, WELCOME TO THE KING WEDDING!</h2>
      <p>Explore the site by using the menu button in the top left corner.</p>
      <h3>CHECK OUT THE FOLLOWING ACTIVITIES</h3>
      <ul className="welcome-list">
        <li>Upload images throughout the night in the Photos tab.</li>
        <li>Send us messages in the Messages tab.</li>
        <li>See where you rank in the leaderboard.</li>
        <li>Try the connections.</li>
        <li>Try the wordle.</li>
      </ul>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
};

export default Welcomepage;
