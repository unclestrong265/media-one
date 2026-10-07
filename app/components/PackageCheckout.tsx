"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";

import { useViewportFit } from "./useViewportFit";
import { assetPath } from "../asset-path";
import CheckoutAuth, { clerkPublishableKey } from "./CheckoutAuth";

export type PaidPackage = "Starter" | "Growth" | "Pro";
const prices: Record<PaidPackage, number> = { Starter: 150000, Growth: 350000, Pro: 750000 };
const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export default function PackageCheckout({ packageName, onClose }: { packageName: PaidPackage; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useViewportFit(dialog);
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
    <dialog ref={dialog} className="package-checkout" aria-labelledby="checkout-title" onCancel={onClose}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <button className="close-dialog" onClick={onClose} aria-label="Close checkout"><X /></button>
      <img className="checkout-logo" src={assetPath("/media-one-logo-transparent.png")} alt="Media One Digital" width={180} height={90} />
      <p className="eyebrow">PAY WITH PAYCHANGU</p>
      <h3 id="checkout-title">{packageName} package</h3>
      <p className="checkout-amount">K{prices[packageName].toLocaleString("en-US")}{packageName === "Pro" ? " / first month" : ""}</p>
      {packageName === "Pro" && <p className="checkout-description">Future months are billed separately; this payment does not start automatic recurring charges.</p>}
      {clerkPublishableKey ? <CheckoutAuth>{profile => <CheckoutForm packageName={packageName} profile={profile} />}</CheckoutAuth> : <p className="checkout-error" role="status">Account sign-in is not available yet. Please contact Media One to arrange your package.</p>}
      <p className="checkout-description">Complete your payment on PayChangu’s secure checkout.</p>
    </dialog>
  );
}

function CheckoutForm({ packageName, profile }: { packageName: PaidPackage; profile: { name: string; email: string } }) {
  const [name, setName] = useState(profile.name);
  const email = profile.email;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!apiUrl) {
      setError("Online payments are not available yet. Please contact Media One to arrange payment.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/package-payments`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ package: packageName, name: name.trim(), email: email.trim() }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to start payment. Please try again.");
      const checkoutUrl = new URL(result.data.checkout_url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paychangu.com") {
        throw new Error("Unable to open checkout. Please try again later.");
      }
      window.location.assign(checkoutUrl.href);
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== "TimeoutError" && cause.name !== "TypeError"
        ? cause.message : "Unable to connect to checkout. Please try again later.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={checkout}>
        <label>Full name<input name="name" autoComplete="name" required maxLength={120} value={name} onChange={event => setName(event.target.value)} autoFocus disabled={busy} /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} value={email} readOnly disabled={busy} /></label>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button className="contact-button" type="submit" disabled={busy || !name.trim() || !email.trim()}>
          {busy ? "Opening checkout…" : "Continue to PayChangu"} <ArrowUpRight size={18} />
        </button>
      </form>
  );
}

export function PaymentStatus() {
  const [reference, setReference] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(false);

  async function verify(txRef: string, signal?: AbortSignal) {
    setBusy(true);
    setMessage("Checking your payment with PayChangu…");
    try {
      if (!apiUrl) throw new Error("Unable to check your payment. Please contact Media One with the reference below.");
      const response = await fetch(`${apiUrl}/package-payments/verify`, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ tx_ref: txRef }), signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(25000)]) : AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to verify your payment. Please check again.");
      const confirmed = result.data.status === "paid";
      setPaid(confirmed);
      setMessage(confirmed ? `Payment confirmed for your ${result.data.package} package. Thank you!`
        : result.data.status === "failed" ? "Your payment was unsuccessful. Choose a package to try again, or contact Media One for help."
        : "Payment has not been confirmed yet. If you completed checkout, check again shortly. Otherwise, you can choose a package to try again.");
    } catch (cause) {
      if (signal?.aborted) return;
      setMessage(cause instanceof Error && cause.name === "Error" ? cause.message : "Unable to check payment right now. Please check again.");
    } finally {
      if (!signal?.aborted) setBusy(false);
    }
  }

  useEffect(() => {
    const txRef = new URLSearchParams(window.location.search).get("payment_ref");
    if (!txRef) return;
    setReference(txRef);
    const controller = new AbortController();
    void verify(txRef, controller.signal);
    return () => controller.abort();
  }, []);

  if (!reference) return null;
  return <div className="payment-status" role="status" aria-live="polite">
    <p>{message}</p><p className="payment-reference">Reference: {reference}</p>
    {!paid && <button onClick={() => void verify(reference)} disabled={busy}>{busy ? "Checking…" : "Check payment again"}</button>}
  </div>;
}
