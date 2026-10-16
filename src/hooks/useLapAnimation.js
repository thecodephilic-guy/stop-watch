import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useLapAnimation() {
  const rowRef = useRef(null);

  useEffect(() => {
    if (!rowRef.current) return;

    gsap.fromTo(
      rowRef.current,
      { x: 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "expo.out",
        clearProps: "transform,opacity",
      },
    );
  }, []);

  return rowRef;
}
