import { useState } from "react";
import data from "../connectionsdata.json";

const Connections = () => {
  const [boxes, setBoxes] = useState(data);
  const [selectedWords, setSelectedWords] = useState([]);
  const [attempts, setAttempts] = useState(4);

  const rearrange = () => {
    const shuffled = [...boxes.data].sort(() => Math.random() - 0.5);
    setBoxes({ data: shuffled });
  };

  const checkAttempt = () => {
    if (selectedWords.length == 4) {
      console.log(selectedWords);
      console.log(selectedWords.length);
    }
  };

  const toggleBox = (word) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const clearSelected = () => {
    setSelectedWords([]);
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        backgroundColor: "#000",
      }}
    >
      <h1
        style={{
          margin: "10px 0 0 0",
          color: "white",
        }}
      >
        Connections
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4px",
          width: "92vw",
          aspectRatio: "1 / 1",
          boxSizing: "border-box",
        }}
      >
        {boxes.data.slice(0, 16).map((box, index) => {
          const isSelected = selectedWords.includes(box.word);
          return (
            <div
              key={index}
              onClick={() => toggleBox(box.word)}
              style={{
                backgroundColor: isSelected ? "#5a594e" : "#efefe6",
                color: isSelected ? "white" : "black",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "clamp(10px, 3vw, 24px)",
                textAlign: "center",
                padding: "4px",
                wordBreak: "break-word",
                boxSizing: "border-box",
                aspectRatio: "1 / 1",
                width: "100%",
              }}
            >
              {box.word}
            </div>
          );
        })}
      </div>

      <button
        onClick={rearrange}
        style={{
          padding: "8px 16px",
          fontSize: "clamp(12px, 4vw, 16px)",
          borderRadius: "5px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          marginBottom: "10px",
        }}
      >
        Rearrange
      </button>
      <button
        onClick={clearSelected}
        style={{
          padding: "8px 16px",
          fontSize: "clamp(12px, 4vw, 16px)",
          borderRadius: "5px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          marginBottom: "10px",
        }}
      >
        Clear
      </button>
      <button
        onClick={checkAttempt}
        style={{
          padding: "8px 16px",
          fontSize: "clamp(12px, 4vw, 16px)",
          borderRadius: "5px",
          backgroundColor: "#555",
          color: "white",
          border: "none",
          marginBottom: "10px",
        }}
      >
        Guess
      </button>
    </div>
  );
};

export default Connections;
