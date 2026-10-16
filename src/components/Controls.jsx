import { PlayIcon, PauseIcon, ResetIcon, FlagIcon } from "../icons";

export default function Controls({
  isRunning,
  onStartStop,
  onReset,
  onFlag,
  startBtnRef,
  flagBtnRef,
}) {
  return (
    <div className="controls">
      <button
        ref={startBtnRef}
        id="btn-start-stop"
        className={`btn btn-start ${isRunning ? "stop-mode" : ""}`}
        onClick={onStartStop}
        aria-label={isRunning ? "Stop" : "Start"}
      >
        {isRunning ? <PauseIcon /> : <PlayIcon />}
        {isRunning ? "stop" : "start"}
      </button>

      <button
        id="btn-reset"
        className="btn btn-icon reset-btn"
        disabled={isRunning}
        onClick={onReset}
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
        onClick={onFlag}
        title="Lap"
        aria-label="Record lap"
      >
        <FlagIcon />
      </button>
    </div>
  );
}
