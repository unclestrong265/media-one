"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Globe2,
  Lightbulb,
  Play,
  Printer,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { assetPath } from "./asset-path";
import TeamProfile from "./components/TeamProfile";
import TeamCarousel from "./components/TeamCarousel";
const logo = assetPath("/media-one-logo.png");
const whatsappUrl = "https://wa.me/265999893222";
const team = [
  {
    "name": "Shukuru Sean Jazza",
    "role": "Managing Partner · UX Designer & Developer",
    "image": "Shukuru.png",
    "card": "shukuru",
    "bio": "Shukuru combines technology, creativity and problem-solving to build digital experiences that are both functional and user-focused. As Managing Partner, he contributes to the company’s digital direction while bringing expertise in UX design, development and technology."
  },
  {
    "name": "McLean Mandiza",
    "role": "Managing Partner · Head of Creative Design",
    "image": "Mclean.png",
    "card": "mclean",
    "bio": "McLean leads the creative vision at Media One Digital. With a strong eye for design and brand communication, he transforms ideas into compelling visual experiences that help businesses communicate clearly, professionally and creatively."
  },
  {
    "name": "Benedict Kamang’ani",
    "role": "Head of Operations",
    "image": "Benedict.png",
    "card": "benedict",
    "bio": "Benedict keeps the engine running behind the scenes. He oversees operational processes, coordinates internal activities and helps ensure that our team delivers projects efficiently while maintaining the standards our clients expect."
  },
  {
    "name": "Taya Matola",
    "role": "Project Manager",
    "image": "Taya.png",
    "card": "taya",
    "bio": "Taya brings structure and coordination to every project. She works across teams to keep projects organised, timelines on track and deliverables aligned with client expectations, ensuring ideas move smoothly from concept to completion."
  },
  {
    "name": "Gomezgani Jenda",
    "role": "Accountant",
    "image": "Gome.jpeg",
    "card": "gomezgani",
    "bio": "Gomezgani supports the financial side of the business, helping maintain sound financial processes and accurate records. His work contributes to the stability, accountability and continued growth of Media One Digital."
  },
  {
    "name": "Chikumbutso Bakuwa",
    "role": "Human Resource Manager",
    "image": "Chiku.jpeg",
    "card": "chikumbutso",
    "bio": "Chikumbutso focuses on the people behind the work. He supports our team through effective human resource management, employee coordination and people development, helping foster a positive environment where our team can thrive."
  }
] as const;
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
  ["01", "Starter", "Price on request", "A focused first step for new and growing businesses.", ["Brand starter session", "Core creative deliverables", "Clear next-step plan"]],
  ["02", "Growth", "Price on request", "For businesses ready to build a consistent presence.", ["Strategy + design direction", "Campaign-ready creative", "Ongoing support options"]],
  ["03", "Pro", "Price on request", "For teams that need regular, strategic creative support.", ["Priority creative support", "Digital campaign assets", "Reporting and review"]],
  ["04", "Custom", "Let’s talk", "A tailored partnership built around your goals.", ["Multi-service delivery", "Dedicated project planning", "Made-to-measure scope"]],
] as const;
export default function Page() {
  const [selectedMember, setSelectedMember] = useState<(typeof team)[number] | null>(null);
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
        if (v) setActive(v.target.id === "team" ? "about" : v.target.id);
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
                {showreelPlaying ? "PLAYING · 00:12" : "PLAY SHOWREEL · 01:02"}
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
            <button className="text-link" onClick={() => go("team")}>
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
        <section className="team-section" id="team" aria-labelledby="team-heading">
          <h2 id="team-heading" className="eyebrow team-heading">OUR TEAM</h2>
          <TeamCarousel>
            {team.map((member) => (
              <article className="team-card" key={member.name}>
                <button className="team-profile-button" onClick={() => setSelectedMember(member)} aria-label={`Meet ${member.name}`} aria-haspopup="dialog">
                  <div className="team-portrait">
                    {member.image ? <img src={assetPath(`/team/${member.image}`)} alt={member.name} loading="lazy" /> : <span className="team-initials" aria-hidden="true">CB</span>}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <span className="team-view-profile">View profile <ArrowUpRight size={14} /></span>
                </button>
              </article>
            ))}
          </TeamCarousel>
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
              apps, we bring your ideas to life.
            </p>
            <button className="contact-button" onClick={() => setDialog(true)}>
              Get a quote <ArrowUpRight size={20} />
            </button>
            <div className="contact-links" aria-label="Contact options">
              <a href="mailto:mediaone265@gmail.com"><img src={assetPath("/icons/email.svg")} width={16} height={16} alt="" /> <span>mediaone265@gmail.com</span></a>
              <div className="contact-phone-numbers">
                <img src={assetPath("/icons/phone.svg")} width={16} height={16} alt="" />
                <a href="tel:+265888122555">+265 888 122 555</a>
                <span aria-hidden="true">/</span>
                <a href="tel:+265888693105">+265 888 693 105</a>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><img src={assetPath("/icons/whatsapp.svg")} width={20} height={20} alt="" /> WhatsApp: +265 999 893 222</a>
              <a href="https://www.google.com/maps/search/?api=1&query=Kanjedza%2C%20Blantyre%2C%20Malawi" target="_blank" rel="noreferrer"><img src={assetPath("/icons/location.svg")} width={16} height={16} alt="" /> Kanjedza, Blantyre, Malawi</a>
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
        <a
          className="nav-contact"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Media One Digital on WhatsApp"
        >
          <img src={assetPath("/icons/whatsapp.svg")} width={24} height={24} alt="" />
        </a>
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
          <a href="https://www.instagram.com/mediaonemw/" target="_blank" rel="noreferrer" aria-label="Media One Digital on Instagram"><img src={assetPath("/icons/instagram.svg")} width={16} height={16} alt="" /> Instagram</a>
          <a href="https://web.facebook.com/mediaonemw/" target="_blank" rel="noreferrer" aria-label="Media One Digital on Facebook"><img src={assetPath("/icons/facebook.svg")} width={16} height={16} alt="" /> Facebook</a>
          <a href="https://www.behance.net/mediaonemw" target="_blank" rel="noreferrer" aria-label="Media One Digital on Behance"><Globe2 size={16} /> Behance</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MEDIA ONE DIGITAL. ALL RIGHTS RESERVED.</span>
          <a href="mailto:mediaone265@gmail.com"><img src={assetPath("/icons/email.svg")} width={14} height={14} alt="" /> <span>MEDIAONE265@GMAIL.COM</span></a>
        </div>
      </footer>
      {selectedMember && <TeamProfile member={selectedMember} onClose={() => setSelectedMember(null)} />}
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
