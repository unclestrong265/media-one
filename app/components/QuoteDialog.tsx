"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";

export default function QuoteDialog({ onClose }: { onClose: () => void }) {
  const [brief, setBrief] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="quote-title" onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <button className="close-dialog" onClick={onClose} aria-label="Close"><X /></button>
      <Sparkles size={30} />
      <p className="eyebrow">START A CONVERSATION</p>
      <h3 id="quote-title">Tell us what&apos;s<br />on your mind.</h3>
      <label>Your idea
        <textarea value={brief} onChange={event => setBrief(event.target.value)} autoFocus
          placeholder="A little about your project, goals and timing..." />
      </label>
      <button className="contact-button" disabled={!brief.trim()} onClick={onClose}>
        Send enquiry <Check size={18} />
      </button>
    </dialog>
  );
}
