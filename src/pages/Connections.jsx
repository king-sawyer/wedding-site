import { useState } from "react";
import data from "../connectionsdata.json";

import "./connections.css";

const Connections = () => {
  const [boxes, setBoxes] = useState(data);
  const [selectedWords, setSelectedWords] = useState([]);
  const [attempts, setAttempts] = useState(4);
  const [guesses, setGuesses] = useState([]);
  const [alreadyGuessed, setAlreadyGuessed] = useState(false);
  const [oneAway, setOneAway] = useState(false);

  const rearrange = () => {
    const shuffled = [...boxes.data].sort(() => Math.random() - 0.5);
    setBoxes({ data: shuffled });
  };

  const checkAttempt = () => {
    let categories = [];
    let counts = {};

    boxes["data"].map((box) => {
      if (selectedWords.includes(box.word)) {
        categories.push(box.category);
      }
    });

    if (selectedWords.length < 4) {
      return;
    } else if (guesses.includes(selectedWords)) {
      console.log("Already guessed! :(");
      setAlreadyGuessed(true);
      setTimeout(() => setAlreadyGuessed(false), 2000);
      return;
    }

    categories.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    if (Object.values(counts).length == 1) {
      console.log("Yay!");
    } else if (
      counts[Object.keys(counts)[0]] == 3 ||
      counts[Object.keys(counts)[1]] == 3
    ) {
      console.log("Ooh so close");
      setOneAway(true);
      setTimeout(() => setOneAway(false), 2000);
      setAttempts((attempts) => attempts - 1);
    } else {
      setAttempts((attempts) => attempts - 1);
    }

    setGuesses((prev) => [...prev, selectedWords]);
  };

  const toggleBox = (word) => {
    setSelectedWords((prevSelected) => {
      const isSelected = prevSelected.includes(word);

      if (isSelected) {
        return prevSelected.filter((w) => w !== word);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, word];
      } else {
        return prevSelected;
      }
    });
  };

  const clearSelected = () => {
    setSelectedWords([]);
  };

  return (
    <div style={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}>
      <h1
        style={{
          margin: "10px 0 0 0",
          color: "white",
        }}
      >
        Connections
      </h1>
      <p>Create four groups of four!</p>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="correct1">
          <div className="connections-row">
            {boxes.data.slice(0, 4).map((box, index) => {
              const isSelected = selectedWords.includes(box.word);
              return (
                <div
                  key={index}
                  onClick={() => toggleBox(box.word)}
                  className={`connections-word ${isSelected ? "active" : ""}`}
                >
                  {box.word}
                </div>
              );
            })}
          </div>
        </div>

        <div className="connections-row">
          {boxes.data.slice(4, 8).map((box, index) => {
            const isSelected = selectedWords.includes(box.word);
            return (
              <div
                key={index}
                onClick={() => toggleBox(box.word)}
                className={`connections-word ${isSelected ? "active" : ""}`}
              >
                {box.word}
              </div>
            );
          })}
        </div>

        <div className="connections-row">
          {boxes.data.slice(8, 12).map((box, index) => {
            const isSelected = selectedWords.includes(box.word);
            return (
              <div
                key={index}
                onClick={() => toggleBox(box.word)}
                className={`connections-word ${isSelected ? "active" : ""}`}
              >
                {box.word}
              </div>
            );
          })}
        </div>

        <div className="connections-row">
          {boxes.data.slice(12, 16).map((box, index) => {
            const isSelected = selectedWords.includes(box.word);
            return (
              <div
                key={index}
                onClick={() => toggleBox(box.word)}
                className={`connections-word ${isSelected ? "active" : ""}`}
              >
                {box.word}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {" "}
        <div className={`fade-div ${alreadyGuessed ? "visible" : ""}`}>
          Already Guessed!
        </div>
        <div className={`fade-div ${oneAway ? "visible" : ""}`}>
          One away...
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <p>Mistakes Remaining:</p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80px",
            marginLeft: "20px",
          }}
        >
          {Array.from({ length: attempts }).map((_, index) => (
            <div
              style={{
                backgroundColor: "gray",
                borderRadius: "100%",
                height: "15px",
                width: "15px",
                top: "40%",
                position: "relative",
              }}
              key={index}
            ></div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={rearrange}
          style={{
            padding: "8px 16px",
            fontSize: "clamp(12px, 4vw, 16px)",
            borderRadius: "100px",
            backgroundColor: "#555",
            color: "white",
            border: "2px solid white",
            margin: "10px",
          }}
        >
          Shuffle
        </button>
        <button
          onClick={clearSelected}
          style={{
            padding: "8px 16px",
            fontSize: "clamp(12px, 4vw, 16px)",
            borderRadius: "100px",
            backgroundColor: "#555",
            color: selectedWords.length ? "white" : "gray",
            border: selectedWords.length ? "2px solid white" : "none",
            margin: "10px",
          }}
        >
          Deselect All
        </button>
        <button
          onClick={checkAttempt}
          style={{
            padding: "8px 16px",
            fontSize: "clamp(12px, 4vw, 16px)",
            borderRadius: "100px",
            backgroundColor: "#555",
            color: selectedWords.length == 4 ? "white" : "gray",
            border: selectedWords.length == 4 ? "2px solid white" : "none",
            margin: "10px",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Connections;
