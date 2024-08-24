import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import Confetti from "react-confetti"; // Import React Confetti
import Square from "./square";
import "./styles.css";
import darkImage from "./dark.png";
import rockMusic from "./rock-music.mp3";

function HardMode() {
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [isXTurn, setIsXTurn] = useState(true);
  const [status, setStatus] = useState("");
  const [round, setRound] = useState(1);
  const [gameResults, setGameResults] = useState({
    Player: 0,
    Computer: 0,
    Draw: 0,
  });
  const [nextRoundDisabled, setNextRoundDisabled] = useState(false);
  const [sessionWinner, setSessionWinner] = useState(""); // State for session winner text
  const [showConfetti, setShowConfetti] = useState(false); // State for confetti visibility
  const [isPlaying, setIsPlaying] = useState(false); // State for audio playback
  const audioRef = useRef(null); // Ref for audio element

  function getWinner(squares) {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
    ];

    for (const [a, b, c] of winningPatterns) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handleClick(index) {
    if (getWinner(squares) || squares[index] || !isXTurn) return;

    const copySquares = [...squares];
    copySquares[index] = "X";
    setSquares(copySquares);
    setIsXTurn(false);
  }

  function handleRestart() {
    setIsXTurn(true);
    setSquares(Array(9).fill(""));
    setStatus("");
    setGameResults({ Player: 0, Computer: 0, Draw: 0 });
    setRound(1); // Reset round counter
    setNextRoundDisabled(false); // Enable Next Round button
    setSessionWinner(""); // Clear session winner text
    setShowConfetti(false); // Hide confetti
  }

  function handleNextRound() {
    if (round < 6) {
      setRound((prevRound) => prevRound + 1);
      setSquares(Array(9).fill("")); // Reset game state for the next round
      setIsXTurn(true);
      setStatus(`Round ${round + 1}`);
    } else {
      setNextRoundDisabled(true); // Disable button on 5th round
    }
  }

  // Minimax algorithm to make the computer more competitive
  const minimax = useCallback((newSquares, isMaximizing) => {
    const winner = getWinner(newSquares);
    if (winner === "O") return 1;
    if (winner === "X") return -1;
    if (!newSquares.includes("")) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < newSquares.length; i++) {
        if (newSquares[i] === "") {
          newSquares[i] = "O";
          let score = minimax(newSquares, false);
          newSquares[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < newSquares.length; i++) {
        if (newSquares[i] === "") {
          newSquares[i] = "X";
          let score = minimax(newSquares, true);
          newSquares[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }, []);

  const makeComputerMove = useCallback(() => {
    const copySquares = [...squares];
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < copySquares.length; i++) {
      if (copySquares[i] === "") {
        copySquares[i] = "O";
        const score = minimax(copySquares, false);
        copySquares[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    copySquares[move] = "O";
    setSquares(copySquares);
    setIsXTurn(true);
  }, [squares, minimax]);

  useEffect(() => {
    if (!isXTurn && !getWinner(squares) && squares.includes("")) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500); // Delay to simulate thinking time

      return () => clearTimeout(timer);
    }
  }, [isXTurn, squares, makeComputerMove]);

  useEffect(() => {
    const winner = getWinner(squares);
    if (winner) {
      setStatus(`The winner is ${winner === "X" ? "Human" : "Computer"}!`);
      setGameResults((prev) => ({
        ...prev,
        [winner === "X" ? "Player" : "Computer"]:
          prev[winner === "X" ? "Player" : "Computer"] + 1,
      }));
    } else if (!squares.includes("") && !winner) {
      setStatus("It's a draw!");
      setGameResults((prev) => ({
        ...prev,
        Draw: prev.Draw + 1,
      }));
    } else {
      setStatus(`Next player is ${isXTurn ? "Human" : "Computer"}`);
    }
  }, [squares, isXTurn]);

  useEffect(() => {
    if (round === 6 && !nextRoundDisabled) {
      const { Player, Computer } = gameResults;
      if (Player > Computer) {
        setSessionWinner("You won this session, congratulations");
        setShowConfetti(true);
      } else if (Computer > Player) {
        setSessionWinner("The Winner for this session is Computer");
      } else {
        setSessionWinner("It's a draw for this session");
      }
    }
  }, [round, nextRoundDisabled, gameResults]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 10000); // Hide confetti after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <a href="https://johnkunleajayi.github.io/" target="_blank" rel="noopener noreferrer">
        <img src={darkImage} alt="Dark Theme" className="dark-image" />
      </a>
      <div className="tic-tac-toe-container">
      <div className="title-container">
            <h1>Tic-Tac-Toe Game</h1>
      <p>Mode: Easy</p>
      </div>
        <div className="row">
          <Square value={squares[0]} onClick={() => handleClick(0)} />
          <Square value={squares[1]} onClick={() => handleClick(1)} />
          <Square value={squares[2]} onClick={() => handleClick(2)} />
        </div>
        <div className="row">
          <Square value={squares[3]} onClick={() => handleClick(3)} />
          <Square value={squares[4]} onClick={() => handleClick(4)} />
          <Square value={squares[5]} onClick={() => handleClick(5)} />
        </div>
        <div className="row">
          <Square value={squares[6]} onClick={() => handleClick(6)} />
          <Square value={squares[7]} onClick={() => handleClick(7)} />
          <Square value={squares[8]} onClick={() => handleClick(8)} />
        </div>
        <h3>{status}</h3>

        <button
          className="next-round-btn"
          onClick={handleNextRound}
          disabled={nextRoundDisabled}
        >
          Next Round
        </button>
        <div className="game-results-container">
          <h4>Game Results</h4>
          <p>Human Wins: {gameResults.Player}</p>
          <p>Computer Wins: {gameResults.Computer}</p>
          <p>Draws: {gameResults.Draw}</p>
        </div>
        {sessionWinner && <h2 className="session-winner">{sessionWinner}</h2>}
        {showConfetti && <Confetti />}
      </div>
      <div className="button-container">
        <button className="restart-btn" onClick={handleRestart}>
          Restart
        </button>
        <button
          className={`play-sound-btn ${isPlaying ? 'pause' : 'play'}`}
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause Sound' : 'Play Sound'}
        </button>

        <audio ref={audioRef} src={rockMusic} loop />
      </div>
    </>
  );
}

HardMode.propTypes = {
  status: PropTypes.string,
  round: PropTypes.number,
  gameResults: PropTypes.shape({
    Player: PropTypes.number.isRequired,
    Computer: PropTypes.number.isRequired,
    Draw: PropTypes.number.isRequired,
  }),
  handleRestart: PropTypes.func.isRequired,
  handleNextRound: PropTypes.func.isRequired,
};

export default HardMode;
