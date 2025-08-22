import { useState, useEffect } from "react";
import { supabase } from "../SupabaseClient";
import { ClipLoader } from "react-spinners";

const Messages = ({ userData }) => {
  const user = userData;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
    } else {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleAddMessage = async () => {
    const messageText = prompt("Enter your new message:");
    if (messageText) {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          { message: messageText, name: user.first, uuid: user.usedId },
        ]);

      if (error) {
        console.error("Error adding message:", error);
      } else {
        console.log("Message added successfully:", data);
        fetchMessages(); // Re-fetch messages to update the list
      }
    }
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
        <ClipLoader
          color={"#5a86ad"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages</h2>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <ul>
          {messages.map((msg) => (
            <li key={msg.id} style={{ marginBottom: "10px" }}>
              <strong>{msg.name}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      )}

      {/* Floating Add Message Button */}
      <div
        onClick={handleAddMessage}
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
