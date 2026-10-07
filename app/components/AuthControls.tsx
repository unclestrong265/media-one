"use client";

import { useClerk, useUser } from "@clerk/react";
import { assetPath } from "../asset-path";

export default function AuthControls() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  if (!isLoaded) return <div className="auth-controls" role="status">Loading account…</div>;
  return <div className="auth-controls" aria-label="Your account">
    {isSignedIn ? <>
      <img className="auth-avatar" src={user.imageUrl} alt={`${user.firstName || "Your"} profile`} width={32} height={32} />
      <button type="button" onClick={() => void signOut()}>Sign out</button>
    </> : <>
      <a href={assetPath("/sign-in/")}>Sign in</a>
      <a href={assetPath("/sign-up/")}>Sign up</a>
    </>}
  </div>;
}
