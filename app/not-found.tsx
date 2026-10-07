import type { Metadata } from "next";
import { assetPath } from "./asset-path";

export const metadata: Metadata = {
  title: "Page not found | Media One Digital",
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <a className="not-found-brand" href={assetPath("/")} aria-label="Media One Digital home">
        <img src={assetPath("/media-one-logo-transparent.png")} alt="Media One Digital" width={180} height={90} />
      </a>
      <img className="not-found-icon" src={assetPath("/icons/not-found.svg")} alt="" width={180} height={180} />
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>This page isn’t here yet.</h1>
      <p>The page you’re looking for is unavailable or may have moved.</p>
      <a className="contact-button" href={assetPath("/")}>Back to home <span aria-hidden="true">↗</span></a>
    </main>
  );
}
