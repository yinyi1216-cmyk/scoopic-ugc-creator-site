"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { KeyboardEvent, SyntheticEvent } from "react";

const applicationUrl =
  "https://docs.google.com/forms/d/1_WmgSFteeQsa0DAs4Psvp8OL0bg5A3cBl0NxR_MBnY8/edit?ts=6a2ff662";
const contactUrl =
  "mailto:marketing@scoopic.ai?subject=Scoopic%20Student%20Ambassador%20Program";

type LandingTheme = "" | "theme-warm" | "theme-dopamine";
type AmbassadorVideo = {
  src: string;
  label: string;
};

const ambassadorVideos: AmbassadorVideo[] = [
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
    question: "Can I apply if I'm not currently in college?",
    answer:
      "Absolutely! We call it Student Ambassador because Scoopic is targeting younger generation around high school and college age. But you don't have to be a student to apply. If you have an active social life, plenty of real moments to share, and a passion for content creation, we'd love to hear from you.",
  },
  {
    question: "Will I post on my personal accounts?",
    answer:
      "No. You'll create new Scoopic TikTok and Instagram accounts using a new Gmail. Your personal accounts stay completely separate.",
  },
  {
    question: "What will I actually be posting?",
    answer:
      "Think real friend moments, camera-roll stories, relatable text hooks, and honest reactions to Scoopic. We'll provide examples, but the content should still feel like YOU. Also search up Scoopic on TikTok and Instagram to see what our current ambassadors are creating!",
  },
  {
    question: "How many videos are we talking about?",
    answer:
      "You'll create ONE short video a day, usually 10 to 40 seconds long, then cross-post it to TikTok and Instagram. One video, two platforms.",
  },
  {
    question: "How much can I earn?",
    answer:
      "Uncapped. You'll receive a $500 monthly base pay, plus view bonuses for every high-performing video. There's no cap on how many videos can earn bonuses, so the more videos that go viral, the more you can make.",
  },
  {
    question: "Do I have to invite friends?",
    answer:
      "Yes. Scoopic is made to be experienced with your people, so you'll be expected to invite at least 5 friends and try it together. Also for each eligible student friend you invite, you will earn $20 once they complete the required steps and pass verification.",
  },
];

const bonusSteps = [
  { views: "50K views", bonus: "$50", x: 74, y: 178, labelY: 212, side: "bottom" },
  { views: "100K views", bonus: "$100", x: 224, y: 154, labelY: 70, side: "top" },
  { views: "500K views", bonus: "$300", x: 374, y: 136, labelY: 170, side: "bottom" },
  { views: "1M views", bonus: "$500", x: 528, y: 112, labelY: 28, side: "top" },
  { views: "2M views", bonus: "$1,000", x: 686, y: 98, labelY: 132, side: "bottom" },
  { views: "5M views", bonus: "$2,000", x: 850, y: 84, labelY: 0, side: "top" },
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
  const [showFloatingApply, setShowFloatingApply] = useState(false);
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(new Set());
  const [activeVideo, setActiveVideo] = useState<AmbassadorVideo | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const heroApply = document.getElementById("hero-apply");
    if (!heroApply) return;

    const onScroll = () => {
      const forceMobileCta = window.matchMedia("(max-width: 760px)").matches;
      const heroRect = heroApply.getBoundingClientRect();
      const heroVisible =
        heroRect.top < window.innerHeight && heroRect.bottom > 0;

      setShowFloatingApply(forceMobileCta || (!heroVisible && window.scrollY > 120));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!activeVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const player = modalVideoRef.current;
    if (player) {
      player.muted = false;
      player.defaultMuted = false;
      player.volume = 1;
      void player.play().catch(() => {
        player.controls = true;
      });
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeActiveVideo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeVideo]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const openVideoModal = (video: AmbassadorVideo) => {
    muteAllAmbassadorVideos();
    flushSync(() => {
      setActiveVideo(video);
    });

    const player = document.querySelector<HTMLVideoElement>(".video-modal-player");
    if (!player) return;

    player.muted = false;
    player.defaultMuted = false;
    player.volume = 1;
    player.currentTime = 0;
    void player.play().catch(() => {
      player.controls = true;
    });
  };

  const closeActiveVideo = () => {
    const player = modalVideoRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    setActiveVideo(null);
  };

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
            <p className="eyebrow">Looking for Passionate GenZ UGC Creators</p>
            <h1>
              <span className="title-line title-white">Become a Scoopic</span>
              <span className="title-line title-lime">Student Ambassador</span>
            </h1>
            <p className="hero-subtitle">
              Be the first creator to experience the next social app for real
              friend groups, create authentic content inspired by real student
              life, and help shape it from day one.
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

      {activeVideo && (
        <div
          aria-label={`${activeVideo.label} player`}
          aria-modal="true"
          className="video-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeActiveVideo();
            }
          }}
          role="dialog"
        >
          <button
            aria-label="Close video"
            className="video-modal-close"
            onClick={closeActiveVideo}
            type="button"
          >
            ×
          </button>
          <div className="video-modal-shell">
            <video
              aria-label={activeVideo.label}
              autoPlay
              className="video-modal-player"
              controls
              playsInline
              preload="auto"
              ref={modalVideoRef}
              src={activeVideo.src}
            />
          </div>
        </div>
      )}

      <section className="home-section product-section" id="what-is-scoopic">
        <div className="section-heading">
          <p className="section-kicker">About Scoopic</p>
          <h2>What is Scoopic?</h2>
          <img className="section-pup steam" src="/assets/pup-green-steam.png" alt="" />
        </div>
        <div className="section-copy feature-copy">
          <p>
            At Scoopic, you&apos;ll unbox a personal paparazzi puppy that turns your
            camera roll moments into playful stories, inside jokes, and memories
            to share with your people.
          </p>
          <div className="product-points" aria-label="Scoopic product points">
            <article>
              <span>01</span>
              <strong>Built for close friends</strong>
              <p>The best Scoopic moments feel like they belong to THE group chat.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Everyone gets a puppy</strong>
              <p>Your paparazzi puppy decodes your camera roll and discovers what makes you YOU.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Your camera roll has lore</strong>
              <p>Scoopic turns your everyday moments into funny, surprising stories worth sharing.</p>
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
          <article className="program-card">
            <span>What you do</span>
            <ol className="program-steps">
              <li>Create ONE short video for Scoopic every day and post it to TikTok + Instagram.</li>
              <li>Bring 5+ friends to Scoopic to experience with you, and see what stories your puppy finds.</li>
              <li>Share honest weekly feedback and help shape what Scoopic becomes.</li>
            </ol>
          </article>
          <article className="program-card payout-card">
            <span>What you get</span>
            <div className="pay-split" aria-label="$500 monthly base plus $2,000 bonus up to">
              <div className="pay-column">
                <strong className="pay-amount pay-base">$500</strong>
                <small className="pay-label pay-base-label">monthly base</small>
              </div>
              <strong className="pay-plus">+</strong>
              <div className="pay-column">
                <strong className="pay-amount pay-bonus">$2,000</strong>
                <small className="pay-label pay-bonus-label">bonus up to</small>
              </div>
            </div>
            <p>
              When your videos reach view milestones, you&apos;ll get bonuses.
            </p>
          </article>
          <BonusLadder />
        </div>
      </section>

      <section className="home-section ambassadors-section" id="ambassadors">
        <div className="section-heading centered">
          <p className="section-kicker">Stories</p>
          <h2>Meet Our Ambassadors</h2>
          <img className="section-pup blue" src="/assets/pup-group-28.svg" alt="" />
        </div>
        <div className="ambassador-orbit" aria-label="Ambassador video examples">
          {ambassadorVideos.map((video, index) => (
            <AmbassadorVideoPhone
              index={index}
              key={video.src}
              label={video.label}
              onOpen={() => openVideoModal(video)}
              src={video.src}
            />
          ))}
        </div>
      </section>

      <section className="home-section faq-section" id="faq">
        <div className="section-heading centered">
          <p className="section-kicker">FAQ</p>
          <h2>If You Wanna Know</h2>
          <p>We&apos;ve prepared some answers</p>
          <img className="section-pup small-green" src="/assets/pup-group-21.svg" alt="" />
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <article
              className={`faq-item ${openFaqIndexes.has(index) ? "is-open" : ""}`}
              key={item.question}
            >
              <button
                aria-controls={`faq-answer-${index}`}
                aria-expanded={openFaqIndexes.has(index)}
                className="faq-question"
                onClick={() => toggleFaq(index)}
                type="button"
              >
                <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.question}</strong>
                <b aria-hidden className="faq-toggle" />
              </button>
              <div
                className={`faq-answer ${openFaqIndexes.has(index) ? "is-open" : ""}`}
                id={`faq-answer-${index}`}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
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

function BonusLadder() {
  return (
    <article className="bonus-ladder" aria-label="View bonus ladder">
      <div className="bonus-ladder-copy">
        <span>View bonus ladder</span>
        <p>Eligible video views unlock higher bonus tiers.</p>
      </div>
      <svg
        aria-hidden="true"
        className="bonus-ladder-chart"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 920 290"
      >
        <path
          className="ladder-curve-base"
          d="M74 178 C128 172 174 162 224 154 C276 144 326 140 374 136 C430 130 480 119 528 112 C584 104 634 101 686 98 C742 94 794 88 850 84"
        />
        <path
          className="ladder-curve-flow"
          d="M74 178 C128 172 174 162 224 154 C276 144 326 140 374 136 C430 130 480 119 528 112 C584 104 634 101 686 98 C742 94 794 88 850 84"
        />
        {bonusSteps.map((step) => {
          const labelX = step.x - 63;
          const connectorStart =
            step.side === "top" ? step.labelY + 56 : step.y + 12;
          const connectorEnd =
            step.side === "top" ? step.y - 12 : step.labelY;

          return (
            <g className="ladder-step" key={step.views}>
              <line
                className="ladder-connector"
                x1={step.x}
                x2={step.x}
                y1={connectorStart}
                y2={connectorEnd}
              />
              <g className="ladder-node" transform={`translate(${step.x} ${step.y})`}>
                <circle className="ladder-node-ring" r="14" />
                <circle className="ladder-node-core" r="6" />
              </g>
              <g className="ladder-label" transform={`translate(${labelX} ${step.labelY})`}>
                <rect height="56" rx="18" width="126" />
                <text textAnchor="middle" x="63" y="23">
                  <tspan className="ladder-views">{step.views}</tspan>
                  <tspan className="ladder-bonus" dy="19" x="63">
                    {step.bonus}
                  </tspan>
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <ol className="bonus-ladder-mobile" aria-label="Bonus milestones">
        {bonusSteps.map((step) => (
          <li key={step.views}>
            <span>{step.views}</span>
            <strong>{step.bonus}</strong>
          </li>
        ))}
      </ol>
    </article>
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
  onOpen,
}: {
  src: string;
  label: string;
  index: number;
  onOpen: () => void;
}) {
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onOpen();
  };

  return (
    <article
      aria-label={label}
      className={`orbit-phone orbit-phone-${index + 1}`}
      onBlur={muteVideoSound}
      onFocus={enableVideoSound}
      onContextMenu={(event) => event.preventDefault()}
      onMouseEnter={enableVideoSound}
      onMouseLeave={muteVideoSound}
      onClick={onOpen}
      onKeyDown={onKeyDown}
      onPointerCancel={muteVideoSound}
      onPointerDown={enableVideoSound}
      onPointerUp={muteVideoSound}
      role="button"
      onTouchCancel={muteVideoSound}
      onTouchEnd={muteVideoSound}
      onTouchStart={enableVideoSound}
      tabIndex={0}
    >
      <div
        className="orbit-phone-screen"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
      >
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

  muteAllAmbassadorVideos(currentVideo);

  currentVideo.volume = 1;
  currentVideo.muted = false;
  currentVideo.defaultMuted = false;
  void currentVideo.play().catch(() => {
    currentVideo.muted = true;
  });
}

function muteVideoSound(event: SyntheticEvent<HTMLElement>) {
  const currentVideo = event.currentTarget.querySelector<HTMLVideoElement>("video");
  if (currentVideo) currentVideo.muted = true;
}

function muteAllAmbassadorVideos(exceptVideo?: HTMLVideoElement) {
  document.querySelectorAll<HTMLVideoElement>(".orbit-phone video").forEach((video) => {
    if (video !== exceptVideo) {
      video.muted = true;
      video.defaultMuted = true;
    }
  });
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
