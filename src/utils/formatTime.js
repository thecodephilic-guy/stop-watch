function formatTime(totalMilliseconds) {
  // 1. Calculate the raw units
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

  // 2. Convert to strings and pad them with a leading zero if they are single digits
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");
  const paddedCentiseconds = centiseconds.toString().padStart(2, "0");

  // 3. Return the clean, formatted string
  return `${paddedMinutes}:${paddedSeconds}:${paddedCentiseconds}`;
}

export default formatTime;
