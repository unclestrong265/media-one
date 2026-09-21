"use client";

import { useEffect, useRef, useState } from "react";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";

const CONSENT_COOKIE = "media_one_cookie_consent";
const CONSENT_VERSION = "1.0";
const MAX_AGE = 60 * 60 * 24 * 180;

type Consent = {
  version: string;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

type OptionalCategory = "preferences" | "analytics" | "marketing";

const categories: Array<{
  key: OptionalCategory;
  title: string;
  description: string;
}> = [
  {
    key: "preferences",
    title: "Preference cookies",
    description: "Remember choices that make future visits more convenient.",
  },
  {
    key: "analytics",
    title: "Analytics cookies",
    description: "Help us understand how visitors use the site and improve it.",
  },
  {
    key: "marketing",
    title: "Marketing cookies",
    description: "Support relevant advertising and campaign measurement.",
  },
];

const defaults = { preferences: false, analytics: false, marketing: false };

function readConsent(): Consent | null {
  const value = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${CONSENT_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");
  if (!value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<Consent>;
    if (
      parsed.version !== CONSENT_VERSION ||
      parsed.necessary !== true ||
      typeof parsed.timestamp !== "string"
    )
      return null;
    return {
      version: CONSENT_VERSION,
      necessary: true,
      preferences: Boolean(parsed.preferences),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

function storeConsent(
  choice: Omit<Consent, "version" | "necessary" | "timestamp">,
): Consent {
  const record: Consent = {
    version: CONSENT_VERSION,
    necessary: true,
    ...choice,
    timestamp: new Date().toISOString(),
  };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(
    new CustomEvent("mediaone:consentchange", { detail: record }),
  );
  return record;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [isManaging, setIsManaging] = useState(false);
  const [draft, setDraft] = useState(defaults);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setConsent(readConsent());
  }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isManaging && !dialog.open) dialog.showModal();
    if (!isManaging && dialog.open) dialog.close();
  }, [isManaging]);

  function openSettings() {
    const current = consent ?? readConsent();
    setDraft(
      current
        ? {
            preferences: current.preferences,
            analytics: current.analytics,
            marketing: current.marketing,
          }
        : defaults,
    );
    setIsManaging(true);
  }
  function save(choice: typeof defaults) {
    setConsent(storeConsent(choice));
    setIsManaging(false);
  }
  if (consent === undefined) return null;

  return (
    <>
      {!consent && (
        <aside className="cookie-banner" aria-label="Cookie consent">
          <div className="cookie-icon">
            <Cookie size={22} />
          </div>
          <div className="cookie-copy">
            <h2>Cookies, your choice.</h2>
            <p>
              We use necessary cookies to make this website work. Optional
              preference, analytics and marketing cookies are only used with
              your permission.
            </p>
          </div>
          <div className="cookie-actions">
            <button className="cookie-manage" onClick={openSettings}>
              Manage preferences
            </button>
            <button className="cookie-reject" onClick={() => save(defaults)}>
              Reject optional
            </button>
            <button
              className="cookie-accept"
              onClick={() =>
                save({ preferences: true, analytics: true, marketing: true })
              }
            >
              Accept all
            </button>
          </div>
        </aside>
      )}
      <button
        className="cookie-settings-trigger"
        onClick={openSettings}
        aria-label="Open cookie settings"
      >
        <Settings2 size={18} />
        <span>Cookie settings</span>
      </button>
      <dialog
        className="cookie-dialog"
        ref={dialogRef}
        onCancel={() => setIsManaging(false)}
      >
        <div className="cookie-dialog-head">
          <div>
            <ShieldCheck size={27} />
            <p className="eyebrow">YOUR PRIVACY</p>
          </div>
          <button
            onClick={() => setIsManaging(false)}
            aria-label="Close cookie settings"
          >
            <X />
          </button>
        </div>
        <h2>Cookie preferences</h2>
        <p className="cookie-dialog-intro">
          Necessary cookies are always on. Choose whether optional cookies can
          be used on this device.
        </p>
        <div className="cookie-category necessary">
          <div>
            <h3>Necessary cookies</h3>
            <p>
              Required for core site functionality and saving your consent
              choice.
            </p>
          </div>
          <span>Always on</span>
        </div>
        {categories.map(({ key, title, description }) => (
          <label className="cookie-category" key={key}>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            <input
              type="checkbox"
              checked={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  [key]: event.target.checked,
                }))
              }
            />
            <span className="switch" aria-hidden="true" />
          </label>
        ))}
        <div className="cookie-dialog-actions">
          <button
            className="cookie-manage"
            onClick={() => setIsManaging(false)}
          >
            Cancel
          </button>
          <button className="cookie-reject" onClick={() => save(defaults)}>
            Reject optional
          </button>
          <button className="cookie-accept" onClick={() => save(draft)}>
            Save choices
          </button>
        </div>
      </dialog>
    </>
  );
}
