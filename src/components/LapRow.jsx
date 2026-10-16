import useLapAnimation from "../hooks/useLapAnimation";
import formatTime from "../utils/formatTime";

export default function LapRow({ lap, index, total }) {
  const rowRef = useLapAnimation();

  const num = total - index; // newest = highest #

  return (
    <div ref={rowRef} className={`lap-row ${index === 0 ? "newest" : ""}`}>
      <span className="lap-num">#{num}</span>
      <span className="lap-elapsed">{formatTime(lap.elapsedTime)}</span>
      <span className="lap-split">+{formatTime(lap.lapDuration)}</span>
    </div>
  );
}
