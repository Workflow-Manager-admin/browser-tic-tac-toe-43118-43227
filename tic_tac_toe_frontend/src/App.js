import React, { useState } from "react";
import "./App.css";

// Customizable theme colors as per requirements
const COLORS = {
  primary: "#1e90ff",
  accent: "#ff5722",
  secondary: "#f0f0f0",
  gridLine: "#e0e0e0",
  winnerHighlight: "#fffae5"
};

// Game initial constants
const INITIAL_BOARD = Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  /**
   * Implements the Tic Tac Toe UI, state, and logic for a two-player local game.
   * UI is minimalistic, modern, accessible, and visually centered.
   * @returns {React.ReactNode}
   */
  // State: 0-8 board (null | "X" | "O"), current turn, winner, finished flag
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState(true);
  const winnerInfo = calculateWinner(board);

  // For highlight logic & announcing result
  const winner = winnerInfo ? winnerInfo.player : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;
  const isFull = board.every(cell => cell !== null);

  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    /**
     * Handles tile click: marks tile, switches player, or no-op if finished/occupied.
     * @param {number} index - Board index of the clicked cell.
     */
    if (board[index] || winner) return;
    const boardCopy = board.slice();
    boardCopy[index] = isXNext ? "X" : "O";
    setBoard(boardCopy);
    setIsXNext(!isXNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    /** Clears board and resets state for a new game. */
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
  }

  // Helper for status/announce
  const status = winner
    ? `Winner: ${winner}`
    : isFull
      ? "It's a draw!"
      : `Next player: ${isXNext ? "X" : "O"}`;

  // Accessibility label for winning squares
  const getCellAriaLabel = (cell, idx) => {
    if (cell == null) return `Cell ${idx + 1}, empty`;
    return winningLine && winningLine.includes(idx)
      ? `${cell}, winning move`
      : `${cell}`;
  };

  // Render -------------------------------------------------------
  return (
    <div
      className="ttt-app"
      style={{
        background: COLORS.secondary,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <div
        className="ttt-root"
        style={{
          minWidth: 300,
          maxWidth: 360,
          margin: "0 auto",
          padding: "32px 24px 24px 24px",
          background: "#fff",
          borderRadius: 22,
          boxShadow: "0 8px 24px rgba(30,144,255,0.07)"
        }}
      >
        {/* Game Title */}
        <h1
          style={{
            letterSpacing: "0.03em",
            fontWeight: 700,
            color: COLORS.primary,
            textAlign: "center",
            fontSize: 25,
            margin: "0 0 20px"
          }}
        >
          Tic Tac Toe
        </h1>
        {/* Game Status and Player Indicator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 16
          }}
        >
          <span
            style={{
              fontWeight: 500,
              fontSize: 18,
              letterSpacing: "0.01em",
              marginBottom: 3,
              color: winner
                ? COLORS.accent
                : isFull
                ? "#bdbdbd"
                : COLORS.primary
            }}
            data-testid="game-status"
          >
            {status}
          </span>
          {!winner && !isFull && (
            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontSize: 14,
                color: "#888"
              }}
            >
              {`Player `}
              <b
                style={{
                  color: isXNext ? COLORS.primary : COLORS.accent
                }}
              >
                {isXNext ? "X" : "O"}
              </b>
              {`'s turn`}
            </div>
          )}
          {winner && (
            <div
              style={{
                fontSize: 16,
                color: COLORS.accent,
                marginTop: 4,
                fontWeight: 600
              }}
              data-testid="winner-announce"
            >
              🎉 Congratulations!
            </div>
          )}
        </div>
        {/* TTT Game Board */}
        <Board
          board={board}
          onCellClick={handleCellClick}
          winningLine={winningLine}
          disabled={!!winner || isFull}
        />
        {/* Controls */}
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <button
            type="button"
            className="ttt-btn"
            onClick={handleRestart}
            style={{
              background: COLORS.primary,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 36px",
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: "0.01em",
              marginTop: 2,
              cursor: "pointer",
              boxShadow: "0 2px 7px rgba(30,144,255,0.08)",
              transition: "background 0.2s"
            }}
            aria-label="Restart game"
          >
            {winner || isFull ? "New Game" : "Restart"}
          </button>
        </div>
        {/* Footer */}
        <footer style={{
          fontSize: 13,
          color: "#bbb",
          marginTop: 32,
          textAlign: "center",
          opacity: 0.92
        }}>
          <span style={{ color: COLORS.primary, fontWeight: 600 }}>X</span>
          {" "}
          <span style={{ color: COLORS.accent, fontWeight: 600 }}>O</span>
          {" game for two players."}
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winningLine, disabled }) {
  /**
   * Renders a 3x3 grid. Each cell is clickable (if not disabled).
   * Winning cells are highlighted.
   */
  return (
    <div
      className="ttt-board"
      style={{
        display: "grid",
        gap: 0,
        gridTemplateColumns: "repeat(3, 1fr)",
        width: 285,
        aspectRatio: "1 / 1",
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        border: `2px solid ${COLORS.gridLine}`,
        boxShadow: "0 2px 4px rgba(30,144,255,0.07)",
        userSelect: "none"
      }}
      role="grid"
      aria-label="Tic Tac Toe board"
    >
      {board.map((cell, idx) => {
        const isWinnerCell = winningLine && winningLine.includes(idx);
        return (
          <button
            key={idx}
            className="ttt-cell"
            style={{
              border: "none",
              borderRight:
                idx % 3 !== 2
                  ? `1.2px solid ${COLORS.gridLine}`
                  : "none",
              borderBottom:
                idx < 6
                  ? `1.2px solid ${COLORS.gridLine}`
                  : "none",
              background: isWinnerCell ? COLORS.winnerHighlight : "#fff",
              transition: "background 0.25s",
              outline: isWinnerCell
                ? `2.5px solid ${COLORS.accent}`
                : "none",
              fontSize: 36,
              fontWeight: 700,
              color:
                cell === "X"
                  ? COLORS.primary
                  : cell === "O"
                  ? COLORS.accent
                  : "#444",
              cursor: !cell && !disabled ? "pointer" : "default",
              width: "100%",
              height: 85,
              lineHeight: "85px",
              borderRadius: "0"
            }}
            tabIndex={0}
            onClick={() => !cell && !disabled && onCellClick(idx)}
            aria-label={cell == null ? `Cell ${idx + 1}, empty` : `${cell}${isWinnerCell ? ", winning move" : ""}`}
            aria-disabled={cell || disabled ? "true" : "false"}
            data-testid={`cell-${idx}`}
            disabled={!!cell || disabled}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Checks for a winner in a Tic Tac Toe board.
 * @param {Array} squares - Array of 9 board values.
 * @returns {{player: "X"|"O", line: number[]} | null}
 */
function calculateWinner(squares) {
  // Possible triples for win
  const lines = [
    // horizontally
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // vertically
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // diagonally
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { player: squares[a], line: lines[i] };
    }
  }
  return null;
}

export default App;
