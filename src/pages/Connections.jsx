import { useEffect, useState } from "react";
import data from "../connectionsdata.json";

const Connections = () => {
  const [boxes, setBoxes] = useState(data);
  const [selectedWords, setSelectedWords] = useState([]);
  const [attempts, setAttempts] = useState(4);
  const [guesses, setGuesses] = useState([]);

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
    console.log(categories);

    if (selectedWords.length < 4) {
      return;
    } //else if(check if guess is already in list of guesses){

    //}

    categories.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    if (Object.values(counts).length == 1) {
      console.log("Yay!");
    } else if (Object.values(counts)[0] == 3) {
      console.log("Ooh so close");
    }

    setGuesses((prev) => [...prev, categories]);

    setAttempts((attempts) => attempts - 1);
  };

  useEffect(() => {
    console.log(guesses);
  }, guesses);

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
      <p>Create four groups of four!</p>

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
                fontSize: "clamp(10px, 2vw, 22px)",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          width: "100vw",
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
