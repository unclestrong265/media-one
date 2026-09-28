"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Facebook,
  Globe2,
  Instagram,
  Lightbulb,
  Mail,
  MessageCircle,
  Play,
  Printer,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
const logo = "/media-one-digital-dark.png";
const nav = [
  ["Home", "home"],
  ["Services", "services"],
  ["Our work", "work"],
  ["Packages", "packages"],
  ["About", "about"],
  ["Insights", "insights"],
  ["Contact", "contact"],
] as const;
const services: [string, string, string, LucideIcon][] = [
  [
    "01",
    "Brand strategy & identity",
    "Clear positioning, visual identity and a brand people recognise.",
    Lightbulb,
  ],
  [
    "02",
    "Digital experiences",
    "Websites and apps that make every interaction feel considered.",
    Code2,
  ],
  [
    "03",
    "Creative campaigns",
    "Ideas, content and campaigns that turn attention into action.",
    Target,
  ],
  [
    "04",
    "Print & production",
    "Tangible work, delivered beautifully from first proof to final finish.",
    Printer,
  ],
];
const packages = [
  ["01", "Starter", "From MWK —", "A focused first step for new and growing businesses.", ["Brand starter session", "Core creative deliverables", "Clear next-step plan"]],
  ["02", "Growth", "From MWK —", "For businesses ready to build a consistent presence.", ["Strategy + design direction", "Campaign-ready creative", "Ongoing support options"]],
  ["03", "Pro", "From MWK —", "For teams that need regular, strategic creative support.", ["Priority creative support", "Digital campaign assets", "Reporting and review"]],
  ["04", "Custom", "Let’s talk", "A tailored partnership built around your goals.", ["Multi-service delivery", "Dedicated project planning", "Made-to-measure scope"]],
] as const;
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
    const motionObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => motionObserver.observe(element));
    return () => {
      observer.disconnect();
      motionObserver.disconnect();
    };
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
          <img src={logo} alt="Media One Digital" />
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, id]) => (
            <button key={id} onClick={() => go(id)} aria-current={active === id ? "page" : undefined}>
              {label}
            </button>
          ))}
        </nav>
        <button className="round-link" onClick={() => setDialog(true)}>
          Get a quote <ArrowUpRight size={16} />
        </button>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-grid">
            <div>
              <p className="eyebrow reveal">CREATIVE + DIGITAL AGENCY / MALAWI</p>
              <h1>
                Let&apos;s build
                <br />
                what gets <i>noticed.</i>
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
              className={`video-player reveal ${showreelPlaying ? "is-playing" : ""}`}
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
          <h2 className="reveal">
            Big thinking, made <i>real.</i>
          </h2>
          <div className="statement-copy">
            <p>
              We bring strategy, creativity and technology into one focused
              team, giving ambitious brands everything they need to make a
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
          <div className="service-list service-cards">
            {services.map(([n, t, d, Icon]) => (
              <article className="reveal" key={n}>
                <span>{n}</span>
                <span className="service-icon"><Icon size={25} strokeWidth={1.5} /></span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                  <button className="service-more" onClick={() => setDialog(true)}>Learn more <ArrowUpRight size={15} /></button>
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
              and corporate gifts, your brand stays consistent everywhere.
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
            <article className="project project-lime reveal">
              <div>
                <span>BRAND IDENTITY / 2026</span>
                <h3>
                  Form
                  <br />& feeling.
                </h3>
              </div>
              <b>01</b>
              <button aria-label="Ask about brand identity projects" onClick={() => setDialog(true)}><ArrowUpRight /></button>
            </article>
            <article className="project project-ink reveal">
              <div>
                <span>DIGITAL EXPERIENCE / 2026</span>
                <h3>
                  Think
                  <br />
                  <i>bigger.</i>
                </h3>
              </div>
              <b>02</b>
              <button aria-label="Ask about digital experience projects" onClick={() => setDialog(true)}><ArrowUpRight /></button>
            </article>
            <article className="project project-yellow reveal">
              <div>
                <span>CREATIVE CAMPAIGN / 2026</span>
                <h3>
                  Hello,
                  <br />
                  tomorrow.
                </h3>
              </div>
              <b>03</b>
              <button aria-label="Ask about campaign projects" onClick={() => setDialog(true)}><ArrowUpRight /></button>
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
            {packages.map(([number, title, price, description, inclusions]) => (
              <article className="reveal" key={title}>
                <span>{number}</span>
                <p className="package-price">{price}</p>
                <h3>{title}</h3>
                <p>{description}</p>
                <ul>{inclusions.map((item) => <li key={item}>{item}</li>)}</ul>
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
            <div className="contact-links" aria-label="Contact options">
              <a href="mailto:hello@mediaone.digital"><Mail size={16} /> Email us</a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp us</a>
            </div>
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
        <div className="footer-brand">
          <img src={logo} alt="Media One Digital" />
          <p>Creative thinking, digital strategy and work that moves brands forward.</p>
        </div>
        <div className="footer-links">
          <strong>Explore</strong>
          {nav.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
        </div>
        <div className="footer-links">
          <strong>Follow us</strong>
          <a href="#" aria-label="Media One Digital on Instagram"><Instagram size={16} /> Instagram</a>
          <a href="#" aria-label="Media One Digital on Facebook"><Facebook size={16} /> Facebook</a>
          <a href="#" aria-label="Media One Digital on LinkedIn"><BriefcaseBusiness size={16} /> LinkedIn</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MEDIA ONE DIGITAL. ALL RIGHTS RESERVED.</span>
          <a href="mailto:hello@mediaone.digital"><Mail size={14} /> HELLO@MEDIAONE.DIGITAL</a>
        </div>
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
