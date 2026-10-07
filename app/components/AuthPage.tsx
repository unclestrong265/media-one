"use client";

import { useRef } from "react";
import { useViewportFit } from "./useViewportFit";
import { SignIn, SignUp } from "@clerk/react";
import { assetPath } from "../asset-path";
import { clerkPublishableKey } from "./CheckoutAuth";

export default function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const home = assetPath("/");
  const content = useRef<HTMLDivElement>(null);
  useViewportFit(content);
  return <main className="auth-page"><div ref={content} className="auth-page-content">
    <a href={home} aria-label="Media One Digital home"><img className="checkout-logo" src={assetPath("/media-one-logo-transparent.png")} alt="Media One Digital" width={180} height={90} /></a>
    {clerkPublishableKey ? mode === "sign-in"
      ? <SignIn routing="hash" signUpUrl={assetPath("/sign-up/")} fallbackRedirectUrl={home} signUpFallbackRedirectUrl={home} />
      : <SignUp routing="hash" signInUrl={assetPath("/sign-in/")} fallbackRedirectUrl={home} signInFallbackRedirectUrl={home} />
      : <p role="status">Account sign-in is not available yet. Please contact Media One.</p>}
    <a href={home}>Back to Media One</a>
  </div></main>;
}
