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
    let frame: number;
    let previous = 0;
    let position: number | null = null;
    const tick = (time: number) => {
      const element = track.current;
      if (element) {
        const bounds = element.getBoundingClientRect();
        const first = element.children[0] as HTMLElement;
        const repeat = element.children[cards.length] as HTMLElement;
        const cycle = repeat && first ? repeat.offsetLeft - first.offsetLeft : 0;
        if (!document.hidden && bounds.bottom >= 0 && bounds.top <= window.innerHeight && cycle > 0) {
          // Retain fractional pixels so slow movement stays smooth on every display.
          if (position === null || Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
          position = (position + Math.min(time - (previous || time), 64) * cycle / 24000) % cycle;
          element.scrollLeft = position;
        } else position = null;
      }
      previous = time;
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
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
