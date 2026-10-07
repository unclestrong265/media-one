"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { assetPath } from "../asset-path";
import { X } from "lucide-react";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => <p className="lanyard-loading" role="status">Loading your team card…</p>,
});

type Member = { name: string; role: string; image: string | null; card: string; bio: string };

class CardFallback extends Component<{ children: ReactNode; card: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <img className="team-card-fallback" src={assetPath(`/lanyard/${this.props.card}.png`)} alt="Team member card" />
      : this.props.children;
  }
}

export default function TeamProfile({ member, onClose }: { member: Member; onClose: () => void }) {
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
    <dialog ref={dialog} className="team-profile-dialog" aria-labelledby="profile-name" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="team-profile-layout">
        <button className="team-profile-close" onClick={onClose} aria-label="Close team profile" autoFocus><X size={24} /></button>
        <div className="team-lanyard-stage">
          <CardFallback card={member.card}>
            <Suspense fallback={<p className="lanyard-loading" role="status">Loading your team card…</p>}>
              <Lanyard position={[0, 0, 26]} gravity={[0, -40, 0]} frontImage={assetPath(`/lanyard/${member.card}.png`)} backImage={assetPath("/lanyard/back.png")} imageFit="contain" lanyardWidth={1} />
            </Suspense>
          </CardFallback>
          <p className="team-drag-hint">Drag the card to move it around</p>
        </div>
        <div className="team-profile-copy">
          <p className="eyebrow">OUR TEAM</p>
          <h2 id="profile-name">{member.name}</h2>
          <p className="team-profile-role">{member.role}</p>
          <p className="team-profile-bio">{member.bio}</p>
        </div>
      </div>
    </dialog>
  );
}
