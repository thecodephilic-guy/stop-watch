import { useEffect, useRef, useState } from "react";
import "./App.css";
import formatTime from "./utils/formatTime";

function App() {
  const [timeElapsed, setTimeElapsed] = useState(0); //ms
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const timePassed = Date.now() - startTimeRef.current;
        setTimeElapsed(timePassed);
      }, 10);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStartStop = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - timeElapsed;
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTimeElapsed(0);
  };

  return (
    <>
      <div>
        <h1>{formatTime(timeElapsed)}</h1>
        <button onClick={handleStartStop}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
}

export default App;
