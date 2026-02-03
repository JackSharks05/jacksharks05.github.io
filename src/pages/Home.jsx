import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RotatingText from "../components/RotatingText";
import ImageCarousel from "../components/ImageCarousel";
import { getConstellationCard } from "../data/constellationCards";
import { getSolarSystemCard, sunLink } from "../data/solarSystemCards";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [hasVisitedPlanetarium, setHasVisitedPlanetarium] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem("planetarium:loaded"));
    } catch {
      return false;
    }
  });

  const [isPlanetarium, setIsPlanetarium] = useState(true);
  const [skyLoaded, setSkyLoaded] = useState(false);
  const [uiUnlocked, setUiUnlocked] = useState(false);
  const [introStageHeight, setIntroStageHeight] = useState(null);
  const [selectedConstellationKeys, setSelectedConstellationKeys] = useState(
    [],
  );
  const [constellationPreview, setConstellationPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnchorClient, setPreviewAnchorClient] = useState(null);
  const stageRef = useRef(null);
  const introOverlayInnerRef = useRef(null);
  const skipNextPlanetariumScrollResetRef = useRef(false);
  const lastEnterHandledLocationKeyRef = useRef(null);
  const lastIntroHandledLocationKeyRef = useRef(null);
  const exitAutoEnterCooldownUntilRef = useRef(0);

  const uiTimerRef = useRef(null);
  const hasActivatedConstellationRef = useRef(false);
  const skyLoadedHandledRef = useRef(false);

  useEffect(() => {
    // Keep a sticky flag so layout can infer current state on mount.
    window.__planetariumIsActive = isPlanetarium;
    window.dispatchEvent(
      new CustomEvent("planetarium:state", { detail: { isPlanetarium } }),
    );

    return () => {
      window.__planetariumIsActive = false;
      window.dispatchEvent(
        new CustomEvent("planetarium:state", {
          detail: { isPlanetarium: false },
        }),
      );
    };
  }, [isPlanetarium]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    // Lock scroll while in planetarium; unlock once "Exit" is pressed.
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = isPlanetarium
      ? "hidden"
      : prevHtmlOverflow;
    document.body.style.overflow = isPlanetarium ? "hidden" : prevBodyOverflow;

    if (isPlanetarium) {
      if (skipNextPlanetariumScrollResetRef.current) {
        skipNextPlanetariumScrollResetRef.current = false;
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isPlanetarium]);

  const enterPlanetarium = ({ smooth = true } = {}) => {
    setIsPreviewOpen(false);
    skipNextPlanetariumScrollResetRef.current = true;
    setIsPlanetarium(true);
    setIntroStageHeight(null);

    if (smooth) {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const openIntro = ({ smooth = true } = {}) => {
    setIsPreviewOpen(false);
    // Suppress the auto-enter-on-top behavior while we transition.
    exitAutoEnterCooldownUntilRef.current = Date.now() + 1200;
    setIsPlanetarium(false);

    // Once the intro overlay is mounted, scroll so that its bottom
    // comes to rest at the bottom of the viewport.
    requestAnimationFrame(() => {
      const el = introOverlayInnerRef.current;
      if (
        !el ||
        typeof window === "undefined" ||
        typeof document === "undefined"
      ) {
        return;
      }

      const docEl = document.documentElement;
      const body = document.body;
      const currentScroll =
        window.scrollY || docEl.scrollTop || body.scrollTop || 0;

      const rect = el.getBoundingClientRect();
      const desiredTop = 140;
      const stageHeight = window.innerHeight + rect.height + desiredTop;
      setIntroStageHeight(stageHeight);

      const elementTop = rect.top + currentScroll;
      const target = Math.max(0, elementTop - desiredTop);
      const behavior = smooth ? "smooth" : "auto";

      if (smooth) {
        if (typeof body.scrollTo === "function") {
          body.scrollTo({ top: target, behavior: "smooth" });
        } else if (typeof docEl.scrollTo === "function") {
          docEl.scrollTo({ top: target, behavior: "smooth" });
        } else {
          try {
            window.scrollTo({ top: target, behavior: "smooth" });
          } catch {
            window.scrollTo(0, target);
          }
        }
      } else {
        try {
          window.scrollTo({ top: target, behavior: behavior });
        } catch {
          window.scrollTo(0, target);
        }
        docEl.scrollTop = target;
        body.scrollTop = target;
      }
    });
  };

  useEffect(() => {
    const onEnter = () => enterPlanetarium({ smooth: true });
    window.addEventListener("planetarium:enter", onEnter);
    return () => window.removeEventListener("planetarium:enter", onEnter);
  }, []);

  useEffect(() => {
    const onIntro = () => openIntro({ smooth: true });
    window.addEventListener("planetarium:intro", onIntro);
    return () => window.removeEventListener("planetarium:intro", onIntro);
  }, []);

  useEffect(() => {
    // When navigating to Home via the header brand link, it sets router state.
    // Use location.key to ensure we only handle once per navigation entry.
    if (!location?.state?.enterPlanetarium) return;
    if (lastEnterHandledLocationKeyRef.current === location.key) return;
    lastEnterHandledLocationKeyRef.current = location.key;
    enterPlanetarium({ smooth: false });
  }, [location.key, location.state]);

  useEffect(() => {
    if (!location?.state?.openIntro) return;
    if (lastIntroHandledLocationKeyRef.current === location.key) return;
    lastIntroHandledLocationKeyRef.current = location.key;
    openIntro({ smooth: false });
  }, [location.key, location.state]);

  const handleConstellationClick = (payload) => {
    const kind = payload?.kind ?? "constellation";
    const key = payload?.key ?? null;
    const name = payload?.name ?? "";

    if (kind === "constellation" && !hasActivatedConstellationRef.current) {
      hasActivatedConstellationRef.current = true;
      window.dispatchEvent(new CustomEvent("constellation:activated"));
    }

    if (payload?.anchorClient) setPreviewAnchorClient(payload.anchorClient);

    if (kind === "body") {
      if (name === "Sun") {
        setIsPreviewOpen(false);
        const to = sunLink.to || "/about";
        const isExternal = /^https?:\/\//i.test(to);
        if (isExternal) {
          window.open(to, "_blank", "noopener,noreferrer");
        } else {
          navigate(to);
        }
        return;
      }

      const card = getSolarSystemCard(name);
      if (!card) return;

      setConstellationPreview({
        title: card.title || name,
        blurb: card.fact || "",
        path: card.to || "/about",
        linkText: card.linkText || "See more",
      });
      setIsPreviewOpen(true);
      return;
    }

    if (key) {
      setSelectedConstellationKeys((prev) =>
        prev.includes(key) ? prev : [...prev, key],
      );
    }

    const card = getConstellationCard(key, name);
    setConstellationPreview({
      title: card.title || name || key,
      blurb: card.fact || "",
      path: card.to || "/about",
      linkText: card.linkText || "See more",
    });
    setIsPreviewOpen(true);
  };

  const openPreviewTarget = () => {
    const to = constellationPreview?.path;
    if (!to) return;
    const isExternal = /^https?:\/\//i.test(to);
    if (isExternal) {
      window.open(to, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(to);
  };

  const handleTogglePlanetarium = () => {
    if (isPlanetarium) {
      openIntro({ smooth: true });
    } else {
      enterPlanetarium({ smooth: true });
    }
  };

  useEffect(() => {
    // When the user scrolls all the way back to the top, immediately re-enter
    // the planetarium.
    if (isPlanetarium) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (Date.now() < exitAutoEnterCooldownUntilRef.current) return;
        if (typeof window === "undefined" || typeof document === "undefined")
          return;
        const docEl = document.documentElement;
        const body = document.body;
        const currentY =
          window.scrollY || docEl.scrollTop || body.scrollTop || 0;
        if (currentY <= 10) {
          enterPlanetarium({ smooth: false });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, [isPlanetarium]);

  const unlockUi = () => {
    setUiUnlocked(true);
    if (uiTimerRef.current) {
      window.clearTimeout(uiTimerRef.current);
      uiTimerRef.current = null;
    }
  };

  const handleSkyLoaded = () => {
    if (skyLoadedHandledRef.current) return;
    skyLoadedHandledRef.current = true;
    setSkyLoaded(true);

    // If the user has already loaded the planetarium once in this session,
    // don't make them wait again.
    if (hasVisitedPlanetarium) {
      setUiUnlocked(true);
      if (uiTimerRef.current) {
        window.clearTimeout(uiTimerRef.current);
        uiTimerRef.current = null;
      }
      return;
    }

    setHasVisitedPlanetarium(true);
    setUiUnlocked(false);
    if (uiTimerRef.current) window.clearTimeout(uiTimerRef.current);
    uiTimerRef.current = window.setTimeout(() => {
      setUiUnlocked(true);
      uiTimerRef.current = null;
    }, 5000);
  };
  useEffect(() => {
    const onLoaded = () => {
      handleSkyLoaded();
    };
    const onFirstDrag = () => {
      unlockUi();
    };
    const onClick = (e) => {
      if (!e?.detail) return;
      handleConstellationClick(e.detail);
    };

    window.addEventListener("planetarium:loaded", onLoaded);
    window.addEventListener("planetarium:first-drag", onFirstDrag);
    window.addEventListener("planetarium:click", onClick);

    // If the planetarium has already loaded (e.g. we navigated away and back),
    // immediately unlock the UI so the exit button is available.
    try {
      if (sessionStorage.getItem("planetarium:loaded")) {
        handleSkyLoaded();
      }
    } catch {
      // Ignore sessionStorage errors (e.g. privacy mode).
    }

    return () => {
      if (uiTimerRef.current) window.clearTimeout(uiTimerRef.current);
      window.removeEventListener("planetarium:loaded", onLoaded);
      window.removeEventListener("planetarium:first-drag", onFirstDrag);
      window.removeEventListener("planetarium:click", onClick);
    };
  }, []);

  return (
    <div className="home">
      <div
        className="home__stage"
        ref={stageRef}
        style={
          introStageHeight ? { height: `${introStageHeight}px` } : undefined
        }
      >
        <div
          className="home__stageFade"
          style={{ opacity: isPlanetarium ? 0.25 : 0.9 }}
        />

        {isPreviewOpen && constellationPreview && (
          <div
            className="home__constellationPreview"
            role="dialog"
            style={(() => {
              if (!stageRef.current) return undefined;
              const rect = stageRef.current.getBoundingClientRect();

              // Mobile: keep the preview readable and anchored above the dock.
              if (rect.width <= 520) {
                return {
                  left: 14,
                  right: 14,
                  bottom: 74,
                  top: "auto",
                  transform: "none",
                };
              }

              // Desktop: center the preview on the screen.
              return {
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              };
            })()}
          >
            <button
              type="button"
              className="home__constellationPreviewClose"
              onClick={() => setIsPreviewOpen(false)}
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="home__constellationPreviewTitle">
              {constellationPreview.title}
            </div>
            <div className="home__constellationPreviewBlurb">
              {constellationPreview.blurb}
            </div>
            <button
              type="button"
              className="home__constellationPreviewLink"
              onClick={openPreviewTarget}
            >
              {constellationPreview.linkText || "See more"}
            </button>
          </div>
        )}
      </div>

      {!isPlanetarium && (
        <div className="home__introOverlay">
          <div className="home__nebula home__nebula--a" aria-hidden="true" />
          <div className="home__nebula home__nebula--b" aria-hidden="true" />

          <div className="home__introOverlayInner" ref={introOverlayInnerRef}>
            <div className="home__intro">
              <div className="home__introText">
                <h2 className="home__h2">Hey, I’m Jack!</h2>
                <p className="home__lead">
                  I am{" "}
                  <RotatingText
                    texts={[
                      "a sidequester",
                      "a puzzlehunter",
                      "a cognitive scientist",
                      "an AI researcher",
                      "a polyglot",
                      "passionately interdisciplinary",
                      "an award-winning speaker",
                      "a classical musician",
                      "intellectually fearless",
                      "a long distance runner",
                      "a translator",
                      "a record-breaker",
                      "a horticulturist",
                      "a linguist",
                      "a mentor",
                      "a ski coach",
                      "a tester",
                      "a traveler",
                      "a inspirer",
                      "a team leader",
                      "an award-winning poet",
                      "a synthesizer",
                      "a behavioral scientist",
                      "a visionary",
                      "a peer advisor",
                      "a slalom skier",
                      "a catalyst",
                      "a film editor",
                      "a calligrapher",
                      "a stargazer",
                    ]}
                    rotationInterval={2200}
                    staggerDuration={0.02}
                    staggerFrom="first"
                    className="home__rotatingText"
                  />
                  . Welcome to my planetarium portfolio! As you'll come to
                  learn, I do a lot of things and love even more! You can use
                  this site to learn about me, see my projects & research
                  experience, hear what I've been listening to recently, read my
                  thoughts...
                </p>
                <p className="home__lead">
                  ...and you can <i>also</i> use it as a fully functioning and
                  accurate planetarium, accurate to the sky above you (really!
                  try it out!)!
                </p>
              </div>

              <div className="home__introMedia">
                <ImageCarousel
                  className="home__carousel carousel--portrait"
                  ariaLabel="Introduction photos"
                  items={[
                    {
                      key: "intro-1",
                      src: "/media/photos/leaf.JPG",
                      alt: "picture of jack holding up a leaf to his face with fall foliage in the background",
                      caption: "autumn in providence :)",
                    },
                    {
                      key: "intro-2",
                      src: "/media/photos/franconia.JPG",
                      alt: "picture of jack by a waterfall in franconia, nh",
                      caption:
                        "hiking the franconia ridge loop in november 2025!",
                    },
                    {
                      key: "intro-3",
                      src: "/media/photos/guards1.jpg",
                      alt: "jack holding a mic in front of a crowd at brown puzzle hunt 2025!",
                      caption: "hosting a game show at brown puzzle hunt 2025!",
                    },
                  ]}
                />
              </div>
            </div>

            <div className="home__cards">
              <div className="home__card">
                <div className="home__cardTitle">What I do</div>
                <div className="home__cardBody">
                  Full-stack engineering, data/visualization, and building tools
                  that feel great to use.
                </div>
                <div className="home__cardLinks">
                  <Link to="/projects">Projects</Link>
                  <Link to="/research">Research</Link>
                </div>
              </div>

              <div className="home__card">
                <div className="home__cardTitle">What I’m into</div>
                <div className="home__cardBody">
                  Astronomy visuals, human-centered interfaces, and music.
                </div>
                <div className="home__cardLinks">
                  <Link to="/music">Music</Link>
                  <Link to="/thoughts">Thoughts</Link>
                </div>
              </div>

              <div className="home__card">
                <div className="home__cardTitle">Let’s talk</div>
                <div className="home__cardBody">
                  If you’re hiring, collaborating, or just curious, I’d love to
                  connect.
                </div>
                <div className="home__cardLinks">
                  <Link to="/resume">Resume</Link>
                  <Link to="/contact">Contact</Link>
                </div>
              </div>
            </div>

            <div className="home__split">
              <div className="home__panel">
                <h3 className="home__h3">Highlights</h3>
                <ul className="home__bullets">
                  <li>Click-to-navigate constellations and sky routing</li>
                  <li>Authoritative stick figures (Stellarium western)</li>
                  <li>Smooth projection blending and realistic twinkle</li>
                </ul>
              </div>
              <div className="home__panel">
                <h3 className="home__h3">Quick links</h3>
                <div className="home__quick">
                  <Link className="home__quickBtn" to="/projects">
                    Projects
                  </Link>
                  <Link className="home__quickBtn" to="/about">
                    About
                  </Link>
                  <Link
                    className="home__quickBtn"
                    to="/photography-videography"
                  >
                    Photo/Video
                  </Link>
                  <Link className="home__quickBtn" to="/contact">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {skyLoaded && (
        <button
          type="button"
          className={
            uiUnlocked
              ? "home__planetariumToggle is-ready"
              : "home__planetariumToggle"
          }
          onClick={handleTogglePlanetarium}
        >
          {isPlanetarium ? "Exit planetarium" : "Enter planetarium"}
        </button>
      )}
    </div>
  );
}
