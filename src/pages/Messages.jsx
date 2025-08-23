import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import { ClipLoader } from "react-spinners";

const Messages = ({ userData }) => {
  const user = userData;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addMessage, setAddMessage] = useState(false);
  const [messageText, setMessageText] = useState("");

  const prompts = [
    "One time when we were hanging out with Shelby and Sawyer ",
    "Man, Sawyer is so ",
    "Jeez, Shelby looks so ",
    "When I am with Shelby and Sawyer I feel so ",
    "My favorite moment with Sawyer and Shelby is ",
    "If I had to describe Shelby and Sawyer in one word it would be ",
    "That time we all laughed so hard because ",
    "I’ll never forget when Shelby ",
    "Sawyer always makes me laugh when ",
    "The best adventure with Shelby and Sawyer was ",
    "If Shelby and Sawyer were a movie, it would be titled ",
    "Hanging out with them always reminds me of ",
    "The funniest thing Shelby ever said was ",
    "The most random thing Sawyer has done is ",
    "One inside joke we’ll never forget is ",
    "That time we stayed up way too late because ",
    "If I had to sum up Sawyer’s vibe in one sentence ",
    "If I had to sum up Shelby’s vibe in one sentence ",
    "The wildest night with Shelby and Sawyer was ",
    "My favorite road trip memory with them is ",
    "If Shelby was a superhero her power would be ",
    "If Sawyer was a superhero his power would be ",
    "I knew we’d be friends forever when ",
    "The time I laughed so hard with them that ",
    "If Shelby and Sawyer had a theme song it would be ",
    "The best prank we ever pulled was ",
    "That time we couldn’t stop singing ",
    "The most awkward thing that happened with them was ",
    "If Sawyer had a catchphrase it would be ",
    "If Shelby had a catchphrase it would be ",
    "That time we thought it was a good idea to ",
    "The best meal we ever shared together was ",
    "The weirdest conversation we’ve ever had was about ",
    "That time everything went wrong but we laughed anyway ",
    "My favorite picture of Shelby and Sawyer is when ",
    "If they were characters in a sitcom, Shelby would be ___ and Sawyer would be ___ ",
    "If I could relive one day with Shelby and Sawyer it would be ",
    "The most chaotic thing we’ve ever done together is ",
    "That one memory that still makes me smile is ",
    "When Shelby starts laughing, it makes everyone ",
    "When Sawyer tells a story, it always ",
    "If I could teleport back to a moment with them, it’d be ",
    "The biggest adventure we still need to go on is ",
    "If I had to give Shelby and Sawyer a duo name, it would be ",
    "The best spontaneous moment we’ve had together was ",
    "That time we got lost but it turned out amazing ",
    "The most unexpected thing Shelby ever did was ",
    "The most unexpected thing Sawyer ever did was ",
    "When I think about Shelby and Sawyer, the first word that pops up is ",
    "That one memory we always retell is ",
    "If I had to make a toast about them, I’d say ",
    "The time we couldn’t stop smiling was ",
    "If life with Shelby and Sawyer were a game, the rules would be ",
    "That time we all tried something new together was ",
    "The most wholesome moment we’ve shared is ",
    "The craziest story I’ll always remember with them is ",
    "If Shelby and Sawyer were emojis, they’d be ___ and ___ ",
  ];

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleAddMessage = async () => {
    if (messageText) {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { message: messageText, name: user.first, uuid: user.userId },
        ]);

      if (error) {
        console.error("Error adding message:", error);
      } else {
        fetchMessages();
      }
    }
  };

  const toggleAddMessage = () => {
    setMessageText("");
    setAddMessage(!addMessage);
  };

  const addPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setMessageText(prompts[randomIndex]);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color={"#5a86ad"} loading={true} size={150} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        width: "100vw",
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignContent: "space-around",
          alignItems: "center",
        }}
      >
        <h2 style={{ flex: "1", textAlign: "center", color: "#5a86ad" }}>
          Messages
        </h2>{" "}
        {/* <p style={{ flex: "1", fontSize: "30px" }}>🔄</p> */}
        <button onClick={fetchMessages} style={{ flex: "0.25" }}>
          Refresh
        </button>
      </div>
      {messages.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No messages yet.</p>
      ) : (
        <ul
          style={{ listStyle: "none", paddingLeft: 0, paddingBottom: "50px" }}
        >
          {messages.map((msg) => (
            <li
              key={msg.id}
              style={{
                backgroundColor: "#f0f4f8",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p style={{ margin: 0, marginBottom: "8px" }}>{msg.message}</p>
              <span
                style={{
                  alignSelf: "flex-end",
                  fontSize: "0.85rem",
                  color: "#555",
                  fontStyle: "italic",
                }}
              >
                -{msg.name}
              </span>
            </li>
          ))}
        </ul>
      )}
      {addMessage && (
        <>
          <div className="backdrop" onClick={toggleAddMessage} />

          <div className="modal">
            <button className="modal-close" onClick={toggleAddMessage}>
              ×
            </button>

            <div className="file-input-wrapper">
              <label>
                <h3>Enter a message:</h3>

                <textarea
                  style={{
                    width: "90%",
                    paddingBottom: "100px",
                    marginBottom: "20px",
                    borderRadius: "6px",
                    overflow: "scroll",
                  }}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </label>
              <button
                style={{
                  padding: "10px",
                  marginRight: "10px",
                }}
                onClick={addPrompt}
              >
                Prompt
              </button>
              <button style={{ padding: "10px" }} onClick={handleAddMessage}>
                Send Message
              </button>
            </div>
          </div>
        </>
      )}
      <div
        onClick={toggleAddMessage}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#5a86ad",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "30px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          userSelect: "none",
        }}
      >
        +
      </div>
    </div>
  );
};

export default Messages;
