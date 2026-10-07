"use client";

import { Children, cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from "react";

export default function TeamCarousel({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children);
  const duplicates = cards.map((card) => {
    if (!isValidElement<{ children: ReactNode }>(card)) return card;
    return cloneElement(card, { "aria-hidden": true } as object, Children.map(card.props.children, child =>
      isValidElement(child) ? cloneElement(child as ReactElement<{ tabIndex: number }>, { tabIndex: -1 }) : child));
  });
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let cycle = 0;
    let visible = false;
    let interacting = false;
    let position = element.scrollLeft;
    let resumeTimer: ReturnType<typeof setTimeout>;
    const measure = () => {
      const first = element.children[0] as HTMLElement;
      const repeat = element.children[cards.length] as HTMLElement;
      cycle = repeat && first ? repeat.offsetLeft - first.offsetLeft : 0;
    };
    const tick = (time: number) => {
      if (Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
      position = (position + Math.min(time - (previous || time), 64) * cycle / 24000) % cycle;
      element.scrollLeft = position;
      previous = time;
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      previous = 0;
      if (visible && !document.hidden && !motion.matches && !interacting && cycle > 0) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    const pause = () => { clearTimeout(resumeTimer); interacting = true; sync(); };
    const resume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        interacting = element.matches(":hover") || element.contains(document.activeElement);
        position = element.scrollLeft;
        sync();
      }, 1500);
    };
    const wheel = () => { pause(); resume(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    const resize = new ResizeObserver(() => { measure(); sync(); });
    resize.observe(element);
    measure();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    element.addEventListener("pointerenter", pause);
    element.addEventListener("pointerleave", resume);
    element.addEventListener("pointerdown", pause);
    element.addEventListener("pointerup", resume);
    element.addEventListener("pointercancel", resume);
    element.addEventListener("focusin", pause);
    element.addEventListener("focusout", resume);
    element.addEventListener("wheel", wheel, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      element.removeEventListener("pointerenter", pause);
      element.removeEventListener("pointerleave", resume);
      element.removeEventListener("pointerdown", pause);
      element.removeEventListener("pointerup", resume);
      element.removeEventListener("pointercancel", resume);
      element.removeEventListener("focusin", pause);
      element.removeEventListener("focusout", resume);
      element.removeEventListener("wheel", wheel);
    };
  }, [cards.length]);

  return (
    <div className="team-carousel" role="region" aria-roledescription="carousel" aria-label="Our team">
      <div className="team-grid" id="team-profiles" ref={track} aria-label="Team profiles">
        {children}
        {duplicates}
      </div>
    </div>
  );
}
