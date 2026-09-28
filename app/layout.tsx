import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import CookieConsent from "./components/CookieConsent";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Media One Digital — Creative. Digital. Delivered.",
  description:
    "Branding, creative design, digital marketing and technology. Built in Malawi, made for possibility.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={playfairDisplay.variable}>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
