import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export default function useStopwatch() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lapRecords, setLapRecords] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const intervalIdRef = useRef(null);
  const startTimeRef = useRef(null);

  const startBtnRef = useRef(null);
  const digitalRef = useRef(null);
  const flagBtnRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 10);
    }

    return () => clearInterval(intervalIdRef.current);
  }, [isRunning]);

  const handleStartStop = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime;
      setIsRunning(true);
      gsap.fromTo(
        startBtnRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.5)" },
      );
      gsap.fromTo(
        digitalRef.current,
        { "--glow-alpha": 0 },
        { "--glow-alpha": 1, duration: 0 }, // just a trigger; CSS handles glow via class
      );
    } else {
      setIsRunning(false);
      gsap.fromTo(
        startBtnRef.current,
        { scale: 0.92 },
        { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" },
      );
    }
  }, [isRunning, elapsedTime]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalIdRef.current);

    gsap.to(digitalRef.current, {
      scale: 0.96,
      opacity: 0.3,
      duration: 0.12,
      onComplete: () => {
        setElapsedTime(0);
        setLapRecords([]);
        gsap.to(digitalRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: "elastic.out(1, 0.4)",
        });
      },
    });
  }, []);

  const handleFlag = useCallback(() => {
    if (!isRunning) return;

    const prevElapsed =
      lapRecords.length > 0 ? lapRecords[lapRecords.length - 1].elapsedTime : 0;

    setLapRecords((prev) => [
      ...prev,
      {
        id: Date.now(),
        elapsedTime,
        lapDuration: elapsedTime - prevElapsed,
      },
    ]);

    /* Pulse ring from flag button */
    const btn = flagBtnRef.current;
    const rect = btn.getBoundingClientRect();
    const ring = document.createElement("div");
    ring.className = "pulse-ring";
    ring.style.width = "32px";
    ring.style.height = "32px";
    ring.style.left = `${rect.left + rect.width / 2}px`;
    ring.style.top = `${rect.top + rect.height / 2}px`;
    document.body.appendChild(ring);

    gsap.fromTo(
      ring,
      { scale: 1, opacity: 0.7 },
      {
        scale: 2.8,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      },
    );

    // Button bounce
    gsap.fromTo(
      btn,
      { scale: 0.78 },
      { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" },
    );

    // Digital border flash
    gsap.fromTo(
      digitalRef.current,
      {
        outlineColor: "rgba(0,232,122,0.7)",
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineOffset: "2px",
      },
      {
        outlineColor: "rgba(0,232,122,0)",
        duration: 0.7,
        ease: "power2.out",
        clearProps: "outline",
      },
    );
  }, [isRunning, elapsedTime, lapRecords]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat) return;

      event.preventDefault();
      switch (event.key.toLowerCase()) {
        case " ":
          handleStartStop();
          break;

        case "r":
          if (!isRunning) {
            handleReset();
          }
          break;

        case "f":
          if (isRunning) {
            handleFlag();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleStartStop, handleReset, handleFlag, isRunning]);

  return {
    elapsedTime,
    isRunning,
    lapRecords,
    handleStartStop,
    handleReset,
    handleFlag,
    startBtnRef,
    digitalRef,
    flagBtnRef,
  };
}
