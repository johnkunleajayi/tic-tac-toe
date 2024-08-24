import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import darkImage from './dark.png';
import rockMusic from './rock-music.mp3';

const WelcomePage = ({ onModeSelect }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

      <audio ref={audioRef} src={rockMusic} loop />

      <div className="welcome-container">
        <h1>Tic-Tac-Toe Game</h1>
        
        <p>Choose your Mode:</p>
        <div className="button-container">
          <button className="mode-btn" onClick={() => onModeSelect('easy')}>Easy Mode</button>
          <button className="mode-btn" onClick={() => onModeSelect('hard')}>Hard Mode</button>
        </div>
        <button className="play-sound-btn" onClick={handlePlayPause}>
          {isPlaying ? 'Pause Sound' : 'Play Sound'}
        </button>
      </div>
    </>
  );
};

WelcomePage.propTypes = {
  onModeSelect: PropTypes.func.isRequired,
};

export default WelcomePage;
