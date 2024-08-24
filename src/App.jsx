import { useState } from 'react'
import WelcomePage from './components/WelcomePage';
import EasyMode from './components/EasyMode';
import HardMode from './components/HardMode';
import './App.css'


function App() {
  const [mode, setMode] = useState(null);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  return (
    <div>
      {!mode && <WelcomePage onModeSelect={handleModeSelect} />}
      {mode === 'easy' && <EasyMode />}
      {mode === 'hard' && <HardMode />}
    </div>
  );
};

export default App;