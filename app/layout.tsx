import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";
export const metadata: Metadata = {
  title: "Media One Digital — Creative. Digital. Delivered.",
  description:
    "Branding, creative design, digital marketing and technology. Built in Malawi, made for possibility.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
