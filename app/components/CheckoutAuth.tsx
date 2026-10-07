"use client";

import { ClerkProvider, SignIn, SignUp, useClerk, useUser } from "@clerk/react";
import { useEffect, useState } from "react";
import { assetPath } from "../asset-path";

export const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function CheckoutAuthProvider({ children }: { children: React.ReactNode }) {
  if (!clerkPublishableKey) return children;
  return <ClerkProvider publishableKey={clerkPublishableKey} appearance={{ elements: { rootBox: { maxWidth: "100%" }, cardBox: { maxWidth: "100%" } } }} signInUrl={assetPath("/sign-in/")} signUpUrl={assetPath("/sign-up/")}>{children}</ClerkProvider>;
}

export default function CheckoutAuth({ children }: { children: (profile: { name: string; email: string }) => React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [urls, setUrls] = useState<{ signIn: string; signUp: string; signup: boolean } | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    const signup = url.searchParams.get("auth") === "signup";
    url.hash = "";
    url.searchParams.delete("auth");
    const signIn = url.href;
    url.searchParams.set("auth", "signup");
    setUrls({ signIn, signUp: url.href, signup });
  }, []);

  if (!isLoaded || !urls) return <p role="status">Loading secure sign-in…</p>;
  if (!isSignedIn) return <div className="checkout-auth">
    {urls.signup
      ? <SignUp appearance={{ elements: { rootBox: { width: "100%" }, cardBox: { width: "100%" }, card: { boxShadow: "none" } } }} routing="hash" signInUrl={urls.signIn} forceRedirectUrl={urls.signIn} />
      : <SignIn appearance={{ elements: { rootBox: { width: "100%" }, cardBox: { width: "100%" }, card: { boxShadow: "none" } } }} routing="hash" signUpUrl={urls.signUp} forceRedirectUrl={urls.signIn} />}
  </div>;
  return <>
    <div className="checkout-account"><span>Signed in as {user.primaryEmailAddress?.emailAddress}</span><button type="button" onClick={() => void signOut()}>Sign out</button></div>
    {children({ name: user.fullName || "", email: user.primaryEmailAddress?.emailAddress || "" })}
  </>;
}
