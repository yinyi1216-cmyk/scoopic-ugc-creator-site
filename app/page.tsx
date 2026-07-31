"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

const applicationUrl =
  "https://docs.google.com/forms/d/1_WmgSFteeQsa0DAs4Psvp8OL0bg5A3cBl0NxR_MBnY8/edit?ts=6a2ff662";
const contactUrl =
  "mailto:marketing@pupixel.ai?subject=Scoopic%20Student%20Ambassador%20Program";

type LandingTheme = "" | "theme-warm" | "theme-dopamine";

const ambassadorVideos = [
  {
    src: "/assets/ambassador-video-1.mp4",
    label: "Ambassador video 01",
  },
  {
    src: "/assets/ambassador-video-2.mp4",
    label: "Ambassador video 02",
  },
  {
    src: "/assets/ambassador-video-3.mp4",
    label: "Ambassador video 03",
  },
  {
    src: "/assets/ambassador-video-4.mp4",
    label: "Ambassador video 04",
  },
  {
    src: "/assets/ambassador-video-5.mp4",
    label: "Ambassador video 05",
  },
  {
    src: "/assets/ambassador-video-8.mp4",
    label: "Ambassador video 06",
  },
];

const faqItems = [
  {
    question: "Do I have to be a current college student?",
    answer:
      "You must be at least 18. Campus roles fit students or people connected to college communities. Graduates and non-students may still be considered for online creator roles if their style fits Scoopic.",
  },
  {
    question: "Do I need to use my personal social accounts?",
    answer:
      "No. Most creators use new Scoopic-focused TikTok and Instagram accounts, so personal accounts and existing content strategies are not affected.",
  },
  {
    question: "What kind of content should I create?",
    answer:
      "Make short, casual videos about friends, daily moments, camera-roll stories, text overlays, and real Scoopic app experiences. Scoopic provides templates and examples; creators keep their own style.",
  },
  {
    question: "How many videos do creators need to post?",
    answer:
      "About 7 short videos per week, or around 28 per month. Videos are usually 10-20 seconds, and the same video can be posted to both TikTok and Instagram.",
  },
  {
    question: "How are referrals tracked?",
    answer:
      "Each participant receives a personal referral code. A referral counts after the friend downloads Scoopic, signs up, completes onboarding, tries the app, and is verified as qualified.",
  },
  {
    question: "Is the $500 base pay per video or per month?",
    answer:
      "The $500 is monthly base pay, not per-video pay. It is paid when deliverables are completed and guidelines are followed. Payments are biweekly through Safeguard; performance bonuses are separate.",
  },
];

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  return <LandingPage />;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand-mark" href="#top" aria-label="Scoopic home">
      <span className="brand-icon">
        <img src="/assets/scoopic-logo.png" alt="" />
      </span>
      {!compact && <span>Scoopic</span>}
    </a>
  );
}

export function LandingPage({ theme = "" }: { theme?: LandingTheme }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showFloatingApply, setShowFloatingApply] = useState(false);

  useEffect(() => {
    const heroApply = document.getElementById("hero-apply");
    const finalApply = document.getElementById("final-apply");
    if (!heroApply) return;

    const onScroll = () => {
      const heroRect = heroApply.getBoundingClientRect();
      const finalRect = finalApply?.getBoundingClientRect();
      const heroVisible =
        heroRect.top < window.innerHeight && heroRect.bottom > 0;
      const finalVisible = finalRect
        ? finalRect.top < window.innerHeight - 20 && finalRect.bottom > 20
        : false;

      setShowFloatingApply(!heroVisible && !finalVisible && window.scrollY > 160);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className={["site", "landing-page", theme].filter(Boolean).join(" ")}>
      <CanvasDecor />
      <div className="hero-shell" id="top">
        <div className="breath breath-one" />
        <div className="breath breath-two" />
        <nav className="top-nav" aria-label="Primary">
          <BrandMark />
          <div className="nav-links">
            <button type="button" onClick={() => scrollToSection("what-is-scoopic")}>
              What is Scoopic
            </button>
            <button type="button" onClick={() => scrollToSection("program")}>
              Program
            </button>
            <button type="button" onClick={() => scrollToSection("ambassadors")}>
              Ambassadors
            </button>
            <button type="button" onClick={() => scrollToSection("faq")}>
              FAQ
            </button>
          </div>
          <a className="contact-link" href={contactUrl}>
            Contact us <span aria-hidden>↗</span>
          </a>
        </nav>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Scoopic Student Ambassador Program</p>
            <h1>
              <span className="title-line title-white">Become a Scoopic</span>
              <span className="title-line title-lime">Student Ambassador</span>
            </h1>
            <p className="hero-subtitle">
              Create campus-native stories with your friends, test Scoopic
              early, and help shape what real social apps feel like.
            </p>
            <a
              className="primary-cta hero-cta"
              href={applicationUrl}
              id="hero-apply"
              rel="noreferrer"
              target="_blank"
            >
              <span>Apply Now</span>
              <b aria-hidden>↗</b>
            </a>
          </div>

          <div className="phone-stage" aria-label="Scoopic app previews">
            <div className="orbit" />
            <PhoneFrame
              src="/assets/app-pup.png"
              alt="Scoopic Pup unwrap screen"
              className="phone-left"
            />
            <PhoneFrame
              src="/assets/app-feed-new.png"
              alt="Scoopic feed screen"
              className="phone-main"
            />
            <PhoneFrame
              src="/assets/app-grid.png"
              alt="Scoopic story sharing screen"
              className="phone-right"
            />
            <img
              className="mascot-hero"
              src="/assets/pup-green-main.png"
              alt="Scoopic mascot"
            />
          </div>
        </section>
      </div>

      <a
        className={`floating-apply ${showFloatingApply ? "is-visible" : ""}`}
        href={applicationUrl}
        rel="noreferrer"
        tabIndex={showFloatingApply ? 0 : -1}
        target="_blank"
      >
        Apply Now <span aria-hidden>↗</span>
      </a>

      <section className="home-section product-section" id="what-is-scoopic">
        <div className="section-heading">
          <p className="section-kicker">About Scoopic</p>
          <h2>What is Scoopic?</h2>
          <img className="section-pup steam" src="/assets/pup-green-steam.png" alt="" />
        </div>
        <div className="section-copy feature-copy">
          <p>
            Scoopic turns everyday moments into private, funny stories for
            real friends. It is built around photos people already care about,
            then adds a playful Pup layer that makes sharing feel personal.
          </p>
          <p>
            The product is not about public performance. It is about found
            memories, friend-group reactions, and the feeling of opening
            something made for you.
          </p>
          <div className="product-points" aria-label="Scoopic product points">
            <article>
              <span>01</span>
              <strong>Photos become stories</strong>
              <p>Scoopic helps real moments turn into quick, shareable story prompts.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Everyone has a Pup</strong>
              <p>Your Pup makes the experience feel ownable, expressive, and easy to recognize.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Built for close friends</strong>
              <p>The best Scoopic moments feel like they belong in a real group chat.</p>
            </article>
          </div>
        </div>
        <div className="feature-phone">
          <img src="/assets/app-story.png" alt="Scoopic story screen" />
        </div>
      </section>

      <section className="home-section program-section" id="program">
        <div className="section-heading">
          <p className="section-kicker">The program</p>
          <h2>Scoopic Student Ambassador Program</h2>
          <img className="section-pup pink" src="/assets/pup-pink-main.png" alt="" />
        </div>
        <div className="program-board">
          <article className="program-card intro-card">
            <span>Project intro</span>
            <h3>Help Scoopic grow on campus while testing the product early.</h3>
            <p>
              This is a paid student ambassador program for creators who can
              make campus-native content, use Scoopic with friends, and share
              product feedback with the team.
            </p>
          </article>
          <article className="program-card">
            <span>What you do</span>
            <ol className="program-steps">
              <li>Create one short-form Scoopic video every day, with 14 videos completed over each two-week cycle.</li>
              <li>Use Scoopic with friends each week and capture real moments, reactions, and app flows that can become content ideas.</li>
              <li>Share feedback, comments, and honest reactions that help Scoopic become better for real friend groups.</li>
            </ol>
          </article>
          <article className="program-card payout-card">
            <span>What you get</span>
            <strong className="pay-highlight">$500-$2,000</strong>
            <p>
              Ambassadors can earn meaningful pay through base work, approved
              content, bonuses, and referrals.
            </p>
          </article>
        </div>
      </section>

      <section className="home-section ambassadors-section" id="ambassadors">
        <div className="section-heading centered">
          <p className="section-kicker">Stories</p>
          <h2>Meet the Ambassadors</h2>
          <img className="section-pup blue" src="/assets/pup-group-28.svg" alt="" />
        </div>
        <div className="ambassador-orbit" aria-label="Ambassador video examples">
          {ambassadorVideos.map((video, index) => (
            <AmbassadorVideoPhone
              index={index}
              key={video.src}
              label={video.label}
              src={video.src}
            />
          ))}
        </div>
      </section>

      <section className="home-section faq-section" id="faq">
        <div className="section-heading centered">
          <p className="section-kicker">FAQ</p>
          <h2>Frequently Asked</h2>
          <p>Clear answers for creators before they apply.</p>
          <img className="section-pup small-green" src="/assets/pup-group-21.svg" alt="" />
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;

            return (
              <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
                <button
                  aria-controls={`faq-answer-${index}`}
                  aria-expanded={isOpen}
                  className="faq-question"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  type="button"
                >
                  <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question}</strong>
                  <b aria-hidden className="faq-toggle">{isOpen ? "-" : "+"}</b>
                </button>
                <div
                  aria-hidden={!isOpen}
                  className={`faq-answer ${isOpen ? "is-open" : ""}`}
                  id={`faq-answer-${index}`}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="final-apply-panel" id="final-apply">
          <span>Ready to build with Scoopic?</span>
          <a
            className="primary-cta final-cta"
            href={applicationUrl}
            rel="noreferrer"
            target="_blank"
          >
            Apply Now <b aria-hidden>↗</b>
          </a>
        </div>
      </section>
    </main>
  );
}

function CanvasDecor() {
  return (
    <div className="canvas-decor" aria-hidden="true">
      <img
        className="canvas-group canvas-lineup"
        src="/assets/decor-pup-lineup-padded.png"
        alt=""
      />
      <img
        className="canvas-group canvas-stories"
        src="/assets/decor-turn-stories-provided.png"
        alt=""
      />
      <img
        className="canvas-group canvas-loop"
        src="/assets/decor-scoopic-loop-provided.png"
        alt=""
      />
    </div>
  );
}

function AmbassadorVideoPhone({
  src,
  label,
  index,
}: {
  src: string;
  label: string;
  index: number;
}) {
  return (
    <article
      aria-label={label}
      className={`orbit-phone orbit-phone-${index + 1}`}
      onBlur={muteVideoSound}
      onFocus={enableVideoSound}
      onMouseEnter={enableVideoSound}
      onMouseLeave={muteVideoSound}
      tabIndex={0}
    >
      <div className="orbit-phone-screen">
        <video
          aria-label={label}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          src={src}
        />
      </div>
    </article>
  );
}

function enableVideoSound(event: SyntheticEvent<HTMLElement>) {
  const currentVideo = event.currentTarget.querySelector<HTMLVideoElement>("video");
  if (!currentVideo) return;

  document.querySelectorAll<HTMLVideoElement>(".orbit-phone video").forEach((video) => {
    if (video !== currentVideo) video.muted = true;
  });

  currentVideo.volume = 0.82;
  currentVideo.muted = false;
  void currentVideo.play().catch(() => {
    currentVideo.muted = true;
  });
}

function muteVideoSound(event: SyntheticEvent<HTMLElement>) {
  const currentVideo = event.currentTarget.querySelector<HTMLVideoElement>("video");
  if (currentVideo) currentVideo.muted = true;
}

function PhoneFrame({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div className={`phone-frame ${className}`}>
      <img src={src} alt={alt} />
    </div>
  );
}
