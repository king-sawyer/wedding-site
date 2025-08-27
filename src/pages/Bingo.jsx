import React, { useState, useEffect } from "react";
import "./bingo.css";
import { ClipLoader } from "react-spinners";

import { supabase } from "../SupabaseClient";

const Bingo = ({ userData }) => {
  const user = userData;

  const [totalBingos, setTotalBingos] = useState(0);
  const [bingoSquares, setBingoSquares] = useState([]);

  const [loading, setLoading] = useState(false);

  const bingoWords = [
    "Use the photo booth",
    "Give someone a kiss",
    "See someone cry",
    "Request a song",
    "Get a tattoo",
    "Try both signature cocktails",
    "Tell a secret",
    "Give Sawyer a hug",
    "Give Shelby a hug",
    "Play a drinking game",
    "Do the connections",
    "Do the wordle",
    "Upload a picture",
    "Send us a message",
    "Do the worm",
    "Twerk",
    "Take a selfie with your table",
    "Leave us a voicemail",
    "Sign the guest book",
    "Make yourself a treat bag",
    "Say hi to the brides parents",
    "Say hi to the grooms parents",
    "Cheers someone not at your table",
    "Scratch off your lottery ticket",
  ];

  const fetchUserBingo = async (userId) => {
    const { data, error } = await supabase
      .from("users")
      .select("bingo_order, bingo_selected, bingoInit")
      .eq("uuid", userId)
      .single();

    if (error) {
      console.error("Error fetching bingo:", error);
      return null;
    }
    return data;
  };

  const [shuffled, setShuffled] = useState(Array(25).fill(""));
  const [selected, setSelected] = useState(Array(25).fill(false));

  const updateTotalBingos = async (numBingos) => {
    await supabase
      .from("users")
      .update({
        totalBingos: numBingos,
      })
      .eq("uuid", user.userId);
  };

  useEffect(() => {
    const initBingo = async () => {
      setLoading(true);
      const data = await fetchUserBingo(user.userId);

      if (data.bingoInit) {
        console.log(data);
        setShuffled(data.bingo_order);
        setSelected(data.bingo_selected);
        setTotalBingos(data.totalBingos);
      } else {
        const copy = [...bingoWords].sort(() => Math.random() - 0.5);
        copy.splice(12, 0, "Free Space");

        setShuffled(copy);
        const initialSelected = Array(25).fill(false);
        initialSelected[12] = true;
        setSelected(initialSelected);

        await supabase
          .from("users")
          .update({
            bingo_order: copy,
            bingo_selected: initialSelected,
            bingoInit: true,
          })
          .eq("uuid", user.userId);
      }
      setLoading(false);
    };

    initBingo();
  }, []);

  useEffect(() => {
    const size = 5;
    let lines = [];
    let squares = new Set();

    // rows
    for (let r = 0; r < size; r++) {
      const rowIndices = [...Array(size).keys()].map((c) => r * size + c);
      if (rowIndices.every((i) => selected[i])) {
        lines.push({ type: "row", index: r });
        rowIndices.forEach((i) => squares.add(i));
      }
    }

    // columns
    for (let c = 0; c < size; c++) {
      const colIndices = [...Array(size).keys()].map((r) => r * size + c);
      if (colIndices.every((i) => selected[i])) {
        lines.push({ type: "col", index: c });
        colIndices.forEach((i) => squares.add(i));
      }
    }

    // diagonals
    const diag1 = [...Array(size).keys()].map((i) => i * size + i);
    if (diag1.every((i) => selected[i])) {
      lines.push({ type: "diag", index: 0 });
      diag1.forEach((i) => squares.add(i));
    }
    const diag2 = [...Array(size).keys()].map((i) => i * size + (size - 1 - i));
    if (diag2.every((i) => selected[i])) {
      lines.push({ type: "diag", index: 1 });
      diag2.forEach((i) => squares.add(i));
    }

    setBingoSquares([...squares]);
    setTotalBingos(lines.length);

    updateTotalBingos(lines.length);
  }, [selected]);

  const toggleSquare = async (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);

    const { error } = await supabase
      .from("users")
      .update({ bingo_selected: newSelected })
      .eq("uuid", user.userId);

    if (error) console.error("Error updating bingo:", error);
  };

  useEffect(() => {
    const size = 5;
    let lines = [];

    // rows
    for (let r = 0; r < size; r++) {
      const rowIndices = [...Array(size).keys()].map((c) => r * size + c);
      if (rowIndices.every((i) => selected[i])) {
        lines.push({ type: "row", index: r });
      }
    }
    // cols
    for (let c = 0; c < size; c++) {
      const colIndices = [...Array(size).keys()].map((r) => r * size + c);
      if (colIndices.every((i) => selected[i])) {
        lines.push({ type: "col", index: c });
      }
    }
    // diagonals
    const diag1 = [...Array(size).keys()].map((i) => i * size + i);
    if (diag1.every((i) => selected[i])) {
      lines.push({ type: "diag", index: 0 });
    }
    const diag2 = [...Array(size).keys()].map((i) => i * size + (size - 1 - i));
    if (diag2.every((i) => selected[i])) {
      lines.push({ type: "diag", index: 1 });
    }

    setTotalBingos(lines.length);

    updateTotalBingos(lines.length);
  }, [selected]);

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
        <div className="bingo">
          <div className="bingo-title-holder">
            <div className="bingo-title">
              <p>K</p>
              <p>I</p>
              <p>N</p>
              <p>G</p>
              <p>O</p>
            </div>
          </div>

          <div className="bingo-board">
            {shuffled.map((word, index) => (
              <div
                className={`word-box ${selected[index] ? "selected" : ""} ${
                  bingoSquares.includes(index) ? "bingo" : ""
                }`}
                key={index}
                onClick={() => toggleSquare(index)}
              >
                {bingoSquares.includes(index) ? (
                  <>
                    <svg viewBox="0 0 96 96" className="sparkle">
                      <path
                        d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"
                        fill="#fff"
                      />
                    </svg>
                    <svg viewBox="0 0 96 96" className="sparkle">
                      <path
                        d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"
                        fill="#fff"
                      />
                    </svg>
                    <svg viewBox="0 0 96 96" className="sparkle">
                      <path
                        d="M93.781 51.578C95 50.969 96 49.359 96 48c0-1.375-1-2.969-2.219-3.578 0 0-22.868-1.514-31.781-10.422-8.915-8.91-10.438-31.781-10.438-31.781C50.969 1 49.375 0 48 0s-2.969 1-3.594 2.219c0 0-1.5 22.87-10.406 31.781-8.908 8.913-31.781 10.422-31.781 10.422C1 45.031 0 46.625 0 48c0 1.359 1 2.969 2.219 3.578 0 0 22.873 1.51 31.781 10.422 8.906 8.911 10.406 31.781 10.406 31.781C45.031 95 46.625 96 48 96s2.969-1 3.562-2.219c0 0 1.523-22.871 10.438-31.781 8.913-8.908 31.781-10.422 31.781-10.422Z"
                        fill="#fff"
                      />
                    </svg>
                    <span>{word.toUpperCase()}</span>
                  </>
                ) : (
                  word.toUpperCase()
                )}
              </div>
            ))}
          </div>

          <div className="bingo-stats">
            <div className="total-bingos">
              <p>TOTAL KINGOS</p>
              <p>{totalBingos}</p>
            </div>
            <div className="color-key">
              <p>COLOR KEY</p>
              <div className="key-item">
                <span className="key-box white" /> Not Done
              </div>
              <div className="key-item">
                <span className="key-box green" /> Done
              </div>
              <div className="key-item">
                <span className="key-box blue" />
                In a KINGO
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bingo;
