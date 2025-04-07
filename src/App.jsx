import React, { useState } from "react";

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);

  const winningCombinations = [
    { combination: [0, 1, 2], type: "row", indices: [0, 1, 2] },
    { combination: [3, 4, 5], type: "row", indices: [3, 4, 5] },
    { combination: [6, 7, 8], type: "row", indices: [6, 7, 8] },
    { combination: [0, 3, 6], type: "column", indices: [0, 3, 6] },
    { combination: [1, 4, 7], type: "column", indices: [1, 4, 7] },
    { combination: [2, 5, 8], type: "column", indices: [2, 5, 8] },
    { combination: [0, 4, 8], type: "diagonal-left-to-right", indices: [0, 4, 8] },
    { combination: [2, 4, 6], type: "diagonal-right-to-left", indices: [2, 4, 6] },
  ];

  // Function to play sounds
  const playSound = (sound) => {
    const audio = new Audio(`/sounds/${sound}.wav`);
    audio.play();
  };

  // Function to determine the winner
  function getWinner(squares) {
    for (const { combination, type, indices } of winningCombinations) {
      const [a, b, c] = combination;

      if (
        squares[a] != null &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { type, indices }; // Return the type and indices of the winning combination
      }
    }
    return null;
  }

  const handleClick = (index) => {
    if (board[index] || getWinner(board)) return;

    const updatedBoard = [...board];
    updatedBoard[index] = isXTurn ? "X" : "O";
    setBoard(updatedBoard);
    setIsXTurn(!isXTurn);
    playSound('placeMove'); // Play sound when a move is placed
  };

  function getGameStatus() {
    const winner = getWinner(board);
    if (winner) {
      playSound('win'); // Play sound when someone wins
      return `Winner is ${board[winner.indices[0]]}`;
    }

    if (board.every((squares) => squares !== null)) {
      playSound('draw'); // Play sound when it's a draw
      return `It's a Draw`;
    }

    return `Turn of Player : ${isXTurn ? "X" : "O"}`;
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
  }

  const winner = getWinner(board);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-[400px] mx-5">
        <h1 className="text-5xl font-semibold text-white mb-8 text-center">
          TIC TAC TOE
        </h1>

        <div
          className={`text-center mb-6 ${
            winner
              ? "text-2xl font-bold text-green-400 animate-bounce"
              : "text-xl text-white"
          }`}
        >
          {getGameStatus()}
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-6">
          {board.map((square, index) => {
            const isWinner =
              winner && winner.indices.includes(index); // Check if this index is part of the winning combination

            return (
              <button
                key={index}
                onClick={() => handleClick(index)}
                className={`h-32 w-full bg-gray-800 rounded-md text-6xl font-light transition-colors duration-200 hover:bg-gray-700 ${
                  square === "X" ? "text-white" : "text-slate-400"
                } ${isWinner ? "relative text-red-500" : ""}`} // Apply styles to the winning buttons
              >
                {square}
                {isWinner && winner.type === "row" && (
                  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 border-t-4 border-red-500" />
                )}
                {isWinner && winner.type === "column" && (
                  <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 border-l-4 border-red-500" />
                )}
                {isWinner && winner.type === "diagonal-left-to-right" && winner.indices.includes(index) && (
                  <div
                    className="absolute top-0 left-1 transform rotate-45"
                    style={{
                      width: "140%", // Ensure the diagonal line is long enough
                      height: "140%",
                      borderTop: "4px solid red",
                      transformOrigin: "top left",
                    }}
                  />
                )}
                {isWinner && winner.type === "diagonal-right-to-left" && winner.indices.includes(index) && (
                  <div
                    className="absolute top-32 left-0 transform -rotate-45"
                    style={{
                      width: "140%", // Ensure the diagonal line is long enough
                      height: "140%",
                      borderTop: "4px solid red",
                      transformOrigin: "top left",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          className="w-full py-3 text-lg text-white border rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200"
          onClick={resetGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default App;
