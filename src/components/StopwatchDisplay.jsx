import formatTime from "../utils/formatTime";

export default function StopwatchDisplay({ elapsedTime, digitalRef }) {
  const time = formatTime(elapsedTime);
  const [minutes, secondsAndCentiseconds] = time.split(":");
  const [seconds, centiseconds] = secondsAndCentiseconds.split(":");

  return (
    <div className="digital-wrap" ref={digitalRef}>
      <p className="time-label">elapsed</p>

      <div className="digital-time">
        <span>{minutes}</span>
        <span className="seg-sep">:</span>
        <span>{seconds}</span>
        <span className="seg-dot">·</span>
        <span className="seg-ms">{centiseconds}</span>
      </div>
    </div>
  );
}
