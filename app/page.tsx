"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type {
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  SyntheticEvent,
} from "react";

const applicationUrl =
  "https://docs.google.com/forms/d/1_WmgSFteeQsa0DAs4Psvp8OL0bg5A3cBl0NxR_MBnY8/edit?ts=6a2ff662";
const contactUrl =
  "mailto:marketing@scoopic.ai?subject=Scoopic%20UGC%20Creator%20Program";
const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";
const assetPath = (path: `/assets/${string}`) => `${assetBasePath}${path}`;

type LandingTheme = "" | "theme-campus" | "theme-warm" | "theme-dopamine";
type AmbassadorVideo = {
  src: string;
  label: string;
};

const ambassadorVideos: AmbassadorVideo[] = [
  {
    src: assetPath("/assets/ambassador-video-1-a365cad9.mp4"),
    label: "Creator video 01",
  },
  {
    src: assetPath("/assets/ambassador-video-2.mp4"),
    label: "Creator video 02",
  },
  {
    src: assetPath("/assets/ambassador-video-3.mp4"),
    label: "Creator video 03",
  },
  {
    src: assetPath("/assets/ambassador-video-4.mp4"),
    label: "Creator video 04",
  },
  {
    src: assetPath("/assets/ambassador-video-5.mp4"),
    label: "Creator video 05",
  },
  {
    src: assetPath("/assets/ambassador-video-6.mp4"),
    label: "Creator video 06",
  },
];

const faqItems = [
  {
    question: "Can I apply if I'm not currently in college?",
    answer:
      "Absolutely! We call this the UGC Creator Program because Scoopic is targeting the younger generation around high school and college age. But you don't have to be a student to apply. If you have an active social life, plenty of real moments to share, and a passion for content creation, we'd love to hear from you.",
  },
  {
    question: "Will I post on my personal accounts?",
    answer:
      "No. You'll create new Scoopic TikTok and Instagram accounts using a new Gmail. Your personal accounts stay completely separate.",
  },
  {
    question: "What will I actually be posting?",
    answer:
      "Think real friend moments, camera-roll stories, relatable text hooks, and honest reactions to Scoopic. We'll provide examples, but the content should still feel like YOU. Also search up Scoopic on TikTok and Instagram to see what our current creators are creating!",
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

function getVideoOffset(index: number, activeIndex: number, total: number) {
  const rawOffset = (index - activeIndex + total) % total;
  return rawOffset > total / 2 ? rawOffset - total : rawOffset;
}

function getVideoPositionClass(offset: number) {
  if (offset === 0) return "is-center";
  if (offset === 1) return "is-near-right";
  if (offset === 2) return "is-far-right";
  if (offset === -1) return "is-near-left";
  if (offset === -2) return "is-far-left";
  return "is-back";
}

export default function Home() {
  return <LandingPage theme="theme-campus" />;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className="brand-mark"
      href="https://scoopic.ai/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Scoopic official website"
    >
      <span className="brand-icon">
        <img src={assetPath("/assets/scoopic-logo.png")} alt="" />
      </span>
      {!compact && <span>Scoopic</span>}
    </a>
  );
}

function SectionTitle({
  id,
  title,
  pup,
  pupClass = "",
}: {
  id?: string;
  title: string;
  pup: `/assets/${string}`;
  pupClass?: string;
}) {
  return (
    <div className="section-heading section-title-row">
      <img
        alt=""
        className={`section-pup ${pupClass}`.trim()}
        src={assetPath(pup)}
      />
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export function LandingPage({ theme = "" }: { theme?: LandingTheme }) {
  const [showFloatingApply, setShowFloatingApply] = useState(false);
  const [openFaqIndexes, setOpenFaqIndexes] = useState<Set<number>>(new Set());
  const [focusedVideoIndex, setFocusedVideoIndex] = useState(0);
  const [isVideoCarouselDragging, setIsVideoCarouselDragging] = useState(false);
  const [activeVideo, setActiveVideo] = useState<AmbassadorVideo | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const carouselDragStartRef = useRef<number | null>(null);
  const carouselDidSwipeRef = useRef(false);
  const carouselManualPauseRef = useRef(0);

  useEffect(() => {
    const heroApply = document.getElementById("hero-apply");
    const finalApply = document.getElementById("final-apply-button");

    const onScroll = () => {
      const forceMobileCta = window.matchMedia("(max-width: 760px)").matches;
      const inlineApplyVisible = [heroApply, finalApply].some((element) => {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0
        );
      });

      setShowFloatingApply(
        !inlineApplyVisible && (forceMobileCta || window.scrollY > 120),
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const closeActiveVideo = () => {
    const player = modalVideoRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    setActiveVideo(null);
  };

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

  useEffect(() => {
    if (activeVideo || isVideoCarouselDragging) return;

    const timer = window.setInterval(() => {
      if (Date.now() - carouselManualPauseRef.current < 6200) return;

      setFocusedVideoIndex((current) => (current + 1) % ambassadorVideos.length);
    }, 3200);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeVideo, isVideoCarouselDragging]);

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
    if (carouselDidSwipeRef.current) return;

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

  const showPreviousVideo = () => {
    carouselManualPauseRef.current = Date.now();
    setFocusedVideoIndex((current) =>
      (current - 1 + ambassadorVideos.length) % ambassadorVideos.length,
    );
  };

  const showNextVideo = () => {
    carouselManualPauseRef.current = Date.now();
    setFocusedVideoIndex((current) => (current + 1) % ambassadorVideos.length);
  };

  const onVideoCarouselPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    carouselDragStartRef.current = event.clientX;
    carouselDidSwipeRef.current = false;
    setIsVideoCarouselDragging(true);
  };

  const onVideoCarouselPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const startX = carouselDragStartRef.current;
    carouselDragStartRef.current = null;
    setIsVideoCarouselDragging(false);

    if (startX === null) return;

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) < 44) return;

    carouselDidSwipeRef.current = true;
    if (deltaX < 0) {
      showNextVideo();
    } else {
      showPreviousVideo();
    }

    window.setTimeout(() => {
      carouselDidSwipeRef.current = false;
    }, 180);
  };

  const onVideoCarouselPointerCancel = () => {
    carouselDragStartRef.current = null;
    carouselDidSwipeRef.current = false;
    setIsVideoCarouselDragging(false);
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
              Creators
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
            <h1>
              <span className="title-line title-white">Become a Scoopic</span>
              <span className="title-line title-lime">UGC Creator</span>
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
              src={assetPath("/assets/app-pup.png")}
              alt="Scoopic Pup unwrap screen"
              className="phone-left"
            />
            <PhoneFrame
              src={assetPath("/assets/app-feed-new.png")}
              alt="Scoopic feed screen"
              className="phone-main"
            />
            <PhoneFrame
              src={assetPath("/assets/app-grid.png")}
              alt="Scoopic story sharing screen"
              className="phone-right"
            />
            <img
              className="mascot-hero"
              src={assetPath("/assets/pup-green-main.png")}
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

      <section className="home-section editorial-section product-section" id="what-is-scoopic">
        <div className="section-shell product-shell">
          <SectionTitle
            pup="/assets/pup-green-steam.png"
            pupClass="steam"
            title="What is Scoopic"
          />
          <div className="product-layout">
            <div className="product-content">
              <p className="product-intro">
                At Scoopic, you&apos;ll unbox a personal paparazzi puppy that turns your
                camera roll moments into playful stories, inside jokes, and memories
                to share with your people.
              </p>
              <ul className="point-list product-prose" aria-label="Scoopic product points">
                <li>
                  <strong>Built for close friends.</strong> The best Scoopic moments feel like they belong to THE group chat.
                </li>
                <li>
                  <strong>Everyone gets a puppy.</strong> Your paparazzi puppy decodes your camera roll and discovers what makes you YOU.
                </li>
                <li>
                  <strong>Your camera roll has lore.</strong> Scoopic turns your everyday moments into funny, surprising stories worth sharing.
                </li>
              </ul>
            </div>
            <div className="product-phone-wrap">
              <div className="feature-phone">
                <img src={assetPath("/assets/app-story.png")} alt="Scoopic story screen" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section editorial-section program-section" id="program">
        <div className="section-shell program-shell">
          <div className="program-board">
            <section className="program-module what-you-do" aria-labelledby="what-you-do-title">
              <SectionTitle
                id="what-you-do-title"
                pup="/assets/pup-pink-main.png"
                pupClass="pink"
                title="What you do"
              />
              <ul className="point-list program-steps">
                <li>Create ONE short video for Scoopic every day and post it to TikTok + Instagram.</li>
                <li>Bring 5+ friends to Scoopic to experience with you, and see what stories your puppy finds.</li>
                <li>Share honest weekly feedback and help shape what Scoopic becomes.</li>
              </ul>
            </section>
            <section className="program-module what-you-get" aria-labelledby="what-you-get-title">
              <SectionTitle
                id="what-you-get-title"
                pup="/assets/pup-group-34.svg"
                pupClass="rose"
                title="What you get"
              />
              <div className="payout-summary">
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
              </div>
              <BonusLadder />
            </section>
          </div>
        </div>
      </section>

      <section className="home-section editorial-section ambassadors-section" id="ambassadors">
        <div className="section-shell ambassadors-shell">
          <SectionTitle
            pup="/assets/pup-group-28.svg"
            pupClass="blue"
            title="Meet Our Creator"
          />
          <div
            className={`ambassador-orbit ${
              isVideoCarouselDragging ? "is-dragging" : ""
            }`}
            aria-label="Creator video examples"
            onPointerCancel={onVideoCarouselPointerCancel}
            onPointerDown={onVideoCarouselPointerDown}
            onPointerUp={onVideoCarouselPointerUp}
          >
          <button
            aria-label="Previous creator video"
            className="orbit-control orbit-control-prev"
            onClick={showPreviousVideo}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            ‹
          </button>
          <button
            aria-label="Next creator video"
            className="orbit-control orbit-control-next"
            onClick={showNextVideo}
            onPointerDown={(event) => event.stopPropagation()}
            type="button"
          >
            ›
          </button>
            {ambassadorVideos.map((video, index) => (
              <AmbassadorVideoPhone
                index={index}
                key={video.src}
                label={video.label}
                onOpen={() => openVideoModal(video)}
                positionClass={getVideoPositionClass(
                  getVideoOffset(index, focusedVideoIndex, ambassadorVideos.length),
                )}
                src={video.src}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-section editorial-section faq-section" id="faq">
        <div className="section-shell compact-shell faq-shell">
          <SectionTitle
            pup="/assets/pup-group-21.svg"
            pupClass="small-green"
            title="If You Wanna Know"
          />
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
                <span aria-hidden className="faq-bullet" />
                <span className="faq-question-text">{item.question}</span>
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
              id="final-apply-button"
              rel="noreferrer"
              target="_blank"
            >
              Apply Now <b aria-hidden>↗</b>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function BonusLadder() {
  return (
    <article className="bonus-ladder" aria-label="Bonus milestones">
      <p className="bonus-ladder-explainer">
        <strong>When your videos reach view milestones, you&apos;ll get bonuses.</strong>
      </p>
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
      <ul className="earning-points" aria-label="Earning details">
        <li>
          <strong>$500 guaranteed</strong> for every completed monthly cycle.
        </li>
        <li>
          Each eligible high-performing video can unlock <strong>up to $2,000.</strong>
        </li>
        <li>
          Bonuses stack across eligible videos, with <strong>no earnings cap.</strong>
        </li>
      </ul>
    </article>
  );
}

function CanvasDecor() {
  return (
    <div className="canvas-decor" aria-hidden="true">
      <img
        className="canvas-group canvas-lineup"
        src={assetPath("/assets/decor-pup-lineup-padded.png")}
        alt=""
      />
      <img
        className="canvas-group canvas-stories"
        src={assetPath("/assets/decor-turn-stories-provided.png")}
        alt=""
      />
      <img
        className="canvas-group canvas-loop"
        src={assetPath("/assets/decor-scoopic-loop-provided.png")}
        alt=""
      />
    </div>
  );
}

function AmbassadorVideoPhone({
  src,
  label,
  index,
  positionClass,
  onOpen,
}: {
  src: string;
  label: string;
  index: number;
  positionClass: string;
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
      className={`orbit-phone orbit-phone-${index + 1} ${positionClass}`}
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
