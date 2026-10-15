import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import "./App.css";
import formatTime from "./utils/formatTime";

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);
const ResetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
  </svg>
);
const FlagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

function LapRow({ lap, index, total }) {
  const rowRef = useRef(null);

  useEffect(() => {
    if (!rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.45, ease: "expo.out", clearProps: "transform,opacity" }
    );
  }, []);

  const num = total - index; // newest = highest #

  return (
    <div ref={rowRef} className={`lap-row ${index === 0 ? "newest" : ""}`}>
      <span className="lap-num">#{num}</span>
      <span className="lap-elapsed">{formatTime(lap.elapsedTime)}</span>
      <span className="lap-split">+{formatTime(lap.lapDuration)}</span>
    </div>
  );
}

function App() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lapRecords,  setLapRecords]  = useState([]);
  const [isRunning,   setIsRunning]   = useState(false);

  const intervalIdRef = useRef(null);
  const startTimeRef  = useRef(null);

  const appRef        = useRef(null);
  const digitalRef    = useRef(null);
  const startBtnRef   = useRef(null);
  const flagBtnRef    = useRef(null);
  const logoDotRef    = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }
    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  // Mount: stagger in panels 
  useEffect(() => {
    if (!appRef.current) return;
    gsap.fromTo(
      appRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }
    );
  }, []);

  const handleStartStop = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      setIsRunning(true);
      gsap.fromTo(startBtnRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" }
      );
      gsap.fromTo(digitalRef.current,
        { "--glow-alpha": 0 },
        { "--glow-alpha": 1, duration: 0 } // just a trigger; CSS handles glow via class
      );
    } else {
      setIsRunning(false);
      gsap.fromTo(startBtnRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" }
      );
    }
  }, [isRunning, elapsedTime]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalIdRef.current);

    gsap.to(digitalRef.current, {
      scale: 0.96, opacity: 0.3, duration: 0.12,
      onComplete: () => {
        setElapsedTime(0);
        setLapRecords([]);
        gsap.to(digitalRef.current, {
          scale: 1, opacity: 1, duration: 0.4, ease: "elastic.out(1, 0.4)",
        });
      },
    });
  }, []);

  const handleFlag = useCallback(() => {
    if (!isRunning) return;

    const prevElapsed = lapRecords.length > 0
      ? lapRecords[lapRecords.length - 1].elapsedTime : 0;

    setLapRecords(prev => [...prev, {
      id: Date.now(),
      elapsedTime,
      lapDuration: elapsedTime - prevElapsed,
    }]);

    /* Pulse ring from flag button */
    const btn  = flagBtnRef.current;
    const rect = btn.getBoundingClientRect();
    const ring = document.createElement("div");
    ring.className = "pulse-ring";
    ring.style.width  = "32px";
    ring.style.height = "32px";
    ring.style.left   = `${rect.left + rect.width / 2}px`;
    ring.style.top    = `${rect.top  + rect.height / 2}px`;
    document.body.appendChild(ring);

    gsap.fromTo(ring,
      { scale: 1, opacity: 0.7 },
      { scale: 2.8, opacity: 0, duration: 0.45, ease: "power2.out",
        onComplete: () => ring.remove() }
    );

    // Button bounce 
    gsap.fromTo(btn,
      { scale: 0.78 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" }
    );

    // Digital border flash
    gsap.fromTo(digitalRef.current,
      { outlineColor: "rgba(0,232,122,0.7)", outlineWidth: "2px", outlineStyle: "solid", outlineOffset: "2px" },
      { outlineColor: "rgba(0,232,122,0)", duration: 0.7, ease: "power2.out",
        clearProps: "outline" }
    );
  }, [isRunning, elapsedTime, lapRecords]);

  // Display
  const mm = String(Math.floor(elapsedTime / 60000)).padStart(2, "0");
  const ss = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, "0");
  const cs = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");

  const status = isRunning ? "running" : elapsedTime > 0 ? "paused" : "idle";
  const dotClass = isRunning ? "" : elapsedTime > 0 ? "pause" : "";

  const reversedLaps = [...lapRecords].reverse();

  return (
    <div className="app" ref={appRef}>

      <header className="app-header">
        <div className={`logo-dot ${dotClass}`} ref={logoDotRef} />
        <span className="app-title">Stopwatch.sohail.world</span>
        <span className={`status-badge ${status}`}>{status}</span>
      </header>

      <section className="left-panel">
        <div className="digital-wrap" ref={digitalRef}>
          <p className="time-label">elapsed</p>
          <div className="digital-time">
            <span>{mm}</span>
            <span className="seg-sep">:</span>
            <span>{ss}</span>
            <span className="seg-dot">·</span>
            <span className="seg-ms">{cs}</span>
          </div>
        </div>

        <div className="controls">
          <button
            ref={startBtnRef}
            id="btn-start-stop"
            className={`btn btn-start ${isRunning ? "stop-mode" : ""}`}
            onClick={handleStartStop}
            aria-label={isRunning ? "Stop" : "Start"}
          >
            {isRunning ? <PauseIcon /> : <PlayIcon />}
            {isRunning ? "stop" : "start"}
          </button>

          <button
            id="btn-reset"
            className="btn btn-icon reset-btn"
            disabled={isRunning}
            onClick={handleReset}
            title="Reset"
            aria-label="Reset"
          >
            <ResetIcon />
          </button>

          <button
            ref={flagBtnRef}
            id="btn-flag"
            className="btn btn-icon flag-btn"
            disabled={!isRunning}
            onClick={handleFlag}
            title="Lap"
            aria-label="Record lap"
          >
            <FlagIcon />
          </button>
        </div>
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
