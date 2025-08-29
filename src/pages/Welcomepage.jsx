import "./welcomepage.css";

const Welcomepage = ({ userData }) => {
  return (
    <div className="welcome-container">
      <h1>LETS CELEBRATE!</h1>
      <h2>HI {userData["first"]}, WELCOME TO THE KING WEDDING!</h2>
      <p>Explore the site by using the menu button in the top left corner.</p>
      <h3>CHECK OUT THE FOLLOWING ACTIVITIES</h3>
      <ul className="welcome-list">
        <li>Check out our itinerary in the Timeline tab.</li>
        <li>Upload images throughout the night in the Photos tab.</li>
        <li>Send us messages in the Messages tab.</li>
        <li>See where you rank in the Leaderboard.</li>
        <li>See if you can get a Bingo!</li>
        <li>Try the Connections.</li>
        <li>Try the Wordle.</li>
        <li>Send us a voicemail using the Voicemail tab.</li>
      </ul>
    </div>
  );
};

export default Welcomepage;
