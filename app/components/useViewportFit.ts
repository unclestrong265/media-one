"use client";

import { useEffect, type RefObject } from "react";

// Keep every control visible, including on short screens and with a keyboard open.
export function useViewportFit(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const fit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const height = window.visualViewport?.height ?? window.innerHeight;
        const naturalHeight = element.offsetHeight;
        element.style.zoom = String(Math.min(1, (height - 24) / Math.max(1, naturalHeight)));
      });
    };
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    fit();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
    };
  }, [ref]);
}
