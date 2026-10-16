import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useAppAnimation() {
  const appRef = useRef(null);

  useEffect(() => {
    if (!appRef.current) return;

    gsap.fromTo(
      appRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 1, ease: "expo.inOut" },
    );
  }, []);

  return appRef;
}
