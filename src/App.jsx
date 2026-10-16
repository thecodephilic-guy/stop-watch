import { useRef } from "react";
import { Analytics } from "@vercel/analytics/next";
import useStopwatch from "./hooks/useStopwatch";
import "./App.css";
import LapRow from "./components/LapRow";
import useAppAnimation from "./hooks/useAppAnimation";
import StopwatchDisplay from "./components/StopwatchDisplay";
import Controls from "./components/Controls";

function App() {
  const {
    elapsedTime,
    isRunning,
    lapRecords,
    handleStartStop,
    handleReset,
    handleFlag,
    digitalRef,
    startBtnRef,
    flagBtnRef,
  } = useStopwatch();

  const appRef = useAppAnimation();

  const logoDotRef = useRef(null);

  const status = isRunning ? "running" : elapsedTime > 0 ? "paused" : "idle";
  const dotClass = isRunning ? "" : elapsedTime > 0 ? "pause" : "";
  const reversedLaps = [...lapRecords].reverse();

  return (
    <div className="app" ref={appRef}>
      <Analytics />

      <header className="app-header">
        <div className={`logo-dot ${dotClass}`} ref={logoDotRef} />
        <span className="app-title">Stopwatch.sohail.world</span>
        <span className={`status-badge ${status}`}>{status}</span>
      </header>

      <section className="left-panel">
        <StopwatchDisplay elapsedTime={elapsedTime} digitalRef={digitalRef} />

        <div className="shortcuts-bar" aria-hidden="true">
          <span className="shortcut-key">
            <kbd>Space</kbd>
            <span className="key-label">start / stop</span>
          </span>
          <span className="shortcut-key">
            <kbd>R</kbd>
            <span className="key-label">reset</span>
          </span>
          <span className="shortcut-key">
            <kbd>F</kbd>
            <span className="key-label">lap</span>
          </span>
        </div>

        <Controls
          isRunning={isRunning}
          onStartStop={handleStartStop}
          onReset={handleReset}
          onFlag={handleFlag}
          startBtnRef={startBtnRef}
          flagBtnRef={flagBtnRef}
        />
      </section>

      <section className="lap-panel">
        <div className="lap-panel-header">
          <span className="lap-title">
            Laps
            {lapRecords.length > 0 && (
              <span className="lap-count">{lapRecords.length}</span>
            )}
          </span>
        </div>

        {lapRecords.length > 0 && (
          <div className="lap-cols-header">
            <span>#</span>
            <span>total</span>
            <span style={{ textAlign: "right" }}>split</span>
          </div>
        )}

        <div className="lap-list">
          {lapRecords.length === 0 ? (
            <div className="lap-empty">
              <div className="lap-empty-icon">⚑</div>
              <p className="lap-empty-text">no laps recorded</p>
            </div>
          ) : (
            reversedLaps.map((lap, idx) => (
              <LapRow
                key={lap.id}
                lap={lap}
                index={idx}
                total={lapRecords.length}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
