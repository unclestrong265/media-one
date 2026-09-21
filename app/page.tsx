"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Globe2,
  Mail,
  MessageCircle,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import logoVector from "../Media One Logo Vector.jpg";
const nav = [
  ["Home", "home"],
  ["Services", "services"],
  ["Our work", "work"],
  ["Packages", "packages"],
  ["About", "about"],
  ["Insights", "insights"],
  ["Contact", "contact"],
] as const;
const services = [
  [
    "01",
    "Brand strategy & identity",
    "Clear positioning, visual identity and a brand people recognise.",
  ],
  [
    "02",
    "Digital experiences",
    "Websites and apps that make every interaction feel considered.",
  ],
  [
    "03",
    "Creative campaigns",
    "Ideas, content and campaigns that turn attention into action.",
  ],
  [
    "04",
    "Print & production",
    "Tangible work, delivered beautifully from first proof to final finish.",
  ],
];
export default function Page() {
  const [active, setActive] = useState("home");
  const [dialog, setDialog] = useState(false);
  const [brief, setBrief] = useState("");
  const [showreelPlaying, setShowreelPlaying] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v) setActive(v.target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.05, 0.3, 0.6] },
    );
    document
      .querySelectorAll<HTMLElement>("section[id]")
      .forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  function go(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }
  return (
    <>
      <header className="topbar">
        <button
          className="brand"
          onClick={() => go("home")}
          aria-label="Media One Digital home"
        >
          <img src={logoVector.src} alt="Media One Digital" />
        </button>
        <p>INDEPENDENT MINDS. SHARED AMBITION.</p>
        <button className="round-link" onClick={() => setDialog(true)}>
          Get a quote <ArrowUpRight size={16} />
        </button>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">MEDIA ONE DIGITAL</p>
              <h1>
                We build brands
                <br />
                that get <i>noticed.</i>
              </h1>
              <p className="intro">
                Creative design, digital marketing and digital solutions for
                ambitious businesses.
              </p>
              <div className="hero-actions">
                <button className="round-link" onClick={() => setDialog(true)}>
                  Get a quote <ArrowUpRight size={16} />
                </button>
                <button className="text-link" onClick={() => go("work")}>
                  View our work <ArrowDown size={18} />
                </button>
              </div>
            </div>
            <button
              className={`video-player ${showreelPlaying ? "is-playing" : ""}`}
              onClick={() => setShowreelPlaying((playing) => !playing)}
              aria-label={
                showreelPlaying
                  ? "Pause Media One showreel"
                  : "Play Media One showreel"
              }
            >
              <span className="video-meta">MEDIA ONE DIGITAL / SHOWREEL</span>
              <span className="video-play">
                <Play size={28} fill="currentColor" />
              </span>
              <span className="video-status">
                {showreelPlaying ? "PLAYING — 00:12" : "PLAY SHOWREEL — 01:02"}
              </span>
            </button>
          </div>
        </section>
        <section className="trust-strip">
          <p>TRUSTED BY BRANDS THAT THINK BIG</p>
          <div className="marquee" aria-label="Selected client logos">
            <div className="marquee-track">
              {Array.from({ length: 2 }, (_, set) => (
                <div
                  className="marquee-group"
                  key={set}
                  aria-hidden={set === 1}
                >
                  {[
                    "YOUR LOGO",
                    "YOUR LOGO",
                    "YOUR LOGO",
                    "YOUR LOGO",
                    "YOUR LOGO",
                  ].map((label, index) => (
                    <span key={`${set}-${index}`}>{label}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="statement" id="about">
          <p className="eyebrow">WHO WE ARE</p>
          <h2>
            Big thinking, made <i>real.</i>
          </h2>
          <div className="statement-copy">
            <p>
              We bring strategy, creativity and technology into one focused
              team—giving ambitious brands everything they need to make a
              meaningful mark.
            </p>
            <button className="text-link" onClick={() => go("contact")}>
              Get to know us <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="number-row">
            <span>
              <b>01</b> Creative
            </span>
            <span>
              <b>02</b> Strategic
            </span>
            <span>
              <b>03</b> Reliable
            </span>
            <span>
              <b>04</b> All-in-one
            </span>
            <span>
              <b>05</b> Local + global
            </span>
          </div>
        </section>
        <section className="services-section" id="services">
          <div className="section-intro">
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              One creative partner.
              <br />
              Many <i>possibilities.</i>
            </h2>
            <p>
              From a first idea to a finished experience, we make every
              touchpoint count.
            </p>
          </div>
          <div className="service-list">
            {services.map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
                <ArrowUpRight />
              </article>
            ))}
          </div>
        </section>
        <section className="focus-section">
          <article>
            <span>DON&apos;T JUST POST. GROW.</span>
            <h3>
              Digital marketing
              <br />
              with <i>momentum.</i>
            </h3>
            <p>
              Social strategy, creative advertising, targeted boosting and
              campaign reporting built to move your business forward.
            </p>
            <button className="text-link" onClick={() => setDialog(true)}>
              Build my digital presence <ArrowUpRight size={17} />
            </button>
          </article>
          <article>
            <span>YOUR BRAND IS MORE THAN A LOGO.</span>
            <h3>
              Built to be
              <br />
              <i>recognised.</i>
            </h3>
            <p>
              From identity systems and company profiles to signs, stationery
              and corporate gifts—your brand stays consistent everywhere.
            </p>
            <button className="text-link" onClick={() => setDialog(true)}>
              Start my brand <ArrowUpRight size={17} />
            </button>
          </article>
        </section>
        <section className="work-section" id="work">
          <div className="section-intro">
            <p className="eyebrow">FEATURED WORK</p>
            <h2>
              We don&apos;t just talk
              <br />
              creative. We <i>show it.</i>
            </h2>
          </div>
          <div className="work-grid">
            <article className="project project-lime">
              <div>
                <span>BRAND IDENTITY / 2026</span>
                <h3>
                  Form
                  <br />& feeling.
                </h3>
              </div>
              <b>01</b>
            </article>
            <article className="project project-ink">
              <div>
                <span>DIGITAL EXPERIENCE / 2026</span>
                <h3>
                  Think
                  <br />
                  <i>bigger.</i>
                </h3>
              </div>
              <b>02</b>
            </article>
            <article className="project project-yellow">
              <div>
                <span>CREATIVE CAMPAIGN / 2026</span>
                <h3>
                  Hello,
                  <br />
                  tomorrow.
                </h3>
              </div>
              <b>03</b>
            </article>
          </div>
          <button className="outline-link" onClick={() => setDialog(true)}>
            View all our work <ArrowUpRight size={18} />
          </button>
        </section>
        <section className="process-section">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>
            A better way
            <br />
            to get it <i>done.</i>
          </h2>
          <div>
            {[
              [
                "01",
                "Discover",
                "Tell us about your business and what you need.",
              ],
              [
                "02",
                "Create",
                "We develop the strategy and creative solution.",
              ],
              ["03", "Review", "You review the work and share feedback."],
              ["04", "Approve", "Refine, approve and prepare for delivery."],
              ["05", "Deliver", "Receive your final work and ongoing support."],
            ].map(([n, t, d]) => (
              <article key={n}>
                <b>{n}</b>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="packages-section" id="packages">
          <p className="eyebrow">CHOOSE YOUR LEVEL</p>
          <h2>
            Start where you
            <br />
            are. Go <i>further.</i>
          </h2>
          <div className="package-grid">
            {[
              ["Starter", "For individuals and small businesses."],
              ["Growth", "For businesses building their presence."],
              ["Pro", "For businesses needing ongoing support."],
              ["Custom", "For tailored, all-in-one solutions."],
            ].map(([t, d], i) => (
              <article key={t}>
                <span>0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
                <button onClick={() => setDialog(true)}>
                  Get started <ArrowUpRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="insights-section" id="insights">
          <div>
            <p className="eyebrow">IDEAS, INSIGHTS & CREATIVE THINKING</p>
            <h2>
              Fresh thinking
              <br />
              for your next <i>move.</i>
            </h2>
          </div>
          <div className="article-list">
            <article>
              <span>BRANDING</span>
              <h3>How strong branding can change your business.</h3>
              <ArrowUpRight />
            </article>
            <article>
              <span>DIGITAL MARKETING</span>
              <h3>Five social media mistakes businesses make.</h3>
              <ArrowUpRight />
            </article>
            <article>
              <span>DESIGN</span>
              <h3>Why your business needs a professional company profile.</h3>
              <ArrowUpRight />
            </article>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div>
            <p className="eyebrow">READY TO MAKE YOUR BRAND STAND OUT?</p>
            <h2>
              Let&apos;s make
              <br />
              something <i>matter.</i>
            </h2>
          </div>
          <div className="contact-side">
            <p>
              From branding and digital marketing to printing, websites and
              apps—we bring your ideas to life.
            </p>
            <button className="contact-button" onClick={() => setDialog(true)}>
              Get a quote <ArrowUpRight size={20} />
            </button>
            <span>
              <Globe2 size={15} /> ROOTED IN MALAWI. THINKING BEYOND.
            </span>
          </div>
        </section>
      </main>
      <nav className="bottom-nav" aria-label="Main navigation">
        {nav.map(([l, id]) => (
          <button
            key={id}
            onClick={() => go(id)}
            aria-current={active === id ? "page" : undefined}
          >
            {l}
          </button>
        ))}
        <button
          className="nav-contact"
          onClick={() => setDialog(true)}
          aria-label="Open contact form"
        >
          <MessageCircle size={18} />
        </button>
      </nav>
      <footer>
        <span>© {new Date().getFullYear()} MEDIA ONE DIGITAL</span>
        <span>BRAND · GROW · CREATE · DELIVER</span>
        <a href="mailto:hello@mediaone.digital">
          <Mail size={14} /> HELLO@MEDIAONE.DIGITAL
        </a>
      </footer>
      {dialog && (
        <dialog
          open
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialog(false);
          }}
        >
          <button
            className="close-dialog"
            onClick={() => setDialog(false)}
            aria-label="Close"
          >
            <X />
          </button>
          <Sparkles size={30} />
          <p className="eyebrow">START A CONVERSATION</p>
          <h3>
            Tell us what&apos;s
            <br />
            on your mind.
          </h3>
          <label>
            Your idea
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="A little about your project, goals and timing..."
            />
          </label>
          <button
            className="contact-button"
            disabled={!brief.trim()}
            onClick={() => setDialog(false)}
          >
            Send enquiry <Check size={18} />
          </button>
        </dialog>
      )}
    </>
  );
}
