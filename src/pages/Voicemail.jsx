import "./welcomepage.css";

const Voicemail = () => {
  return (
    <div className="welcome-container">
      <h1>VOICEMAIL</h1>
      <p>
        We made a Google voicemail number so that you can give us a call and
        leave a voicemail for us to listen to after the party!
      </p>
      <h2>VOICEMAIL SUGGESTIONS</h2>
      <ul className="welcome-list">
        <li>Advice for the couple</li>
        <li>Memories together</li>
        <li>Favorite moments from the evevning</li>
        <li>Boozy confessions</li>
        <li>Unpopular opinions</li>
        <li>Whatever your heart desires</li>
      </ul>
      <p style={{ paddingBottom: "20px" }}>Click below to give us a call!</p>
      <a
        href="tel:503-673-6244"
        style={{
          backgroundColor: "#5a86ad",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        {" "}
        Give us a call!{" "}
      </a>
      <p style={{ paddingTop: "30px" }}>Alternitavely: 503-673-6244</p>
    </div>
  );
};

export default Voicemail;
