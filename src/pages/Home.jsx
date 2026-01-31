import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GalaxyCanvas from "../components/GalaxyCanvas";
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
  const [selectedConstellationKeys, setSelectedConstellationKeys] = useState(
    [],
  );
  const [constellationPreview, setConstellationPreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewAnchorClient, setPreviewAnchorClient] = useState(null);
  const stageRef = useRef(null);
  const landingRef = useRef(null);
  const lastEnterHandledLocationKeyRef = useRef(null);
  const lastIntroHandledLocationKeyRef = useRef(null);
  const exitAutoEnterCooldownUntilRef = useRef(0);

  const uiTimerRef = useRef(null);
  const hasActivatedConstellationRef = useRef(false);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("planetarium:state", { detail: { isPlanetarium } }),
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("planetarium:state", {
          detail: { isPlanetarium: false },
        }),
      );
    };
  }, [isPlanetarium]);

  useEffect(() => {
    // Lock scroll while in planetarium; unlock once "Exit" is pressed.
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = isPlanetarium
      ? "hidden"
      : prevHtmlOverflow;
    document.body.style.overflow = isPlanetarium ? "hidden" : prevBodyOverflow;

    if (isPlanetarium) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isPlanetarium]);

  const enterPlanetarium = ({ smooth = true } = {}) => {
    setIsPreviewOpen(false);
    setIsPlanetarium(true);
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  const openIntro = ({ smooth = true } = {}) => {
    setIsPreviewOpen(false);
    setIsPlanetarium(false);

    // Suppress the auto-enter-on-top behavior while we transition.
    exitAutoEnterCooldownUntilRef.current = Date.now() + 1200;

    requestAnimationFrame(() => {
      const el = landingRef.current;
      if (!el) return;
      const landingTop = el.getBoundingClientRect().top + (window.scrollY || 0);
      const revealFactor = window.innerWidth <= 520 ? 0.25 : 0.5;
      const target = Math.max(
        0,
        landingTop - window.innerHeight * revealFactor,
      );
      window.scrollTo({ top: target, behavior: smooth ? "smooth" : "auto" });
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
    setIsPlanetarium((v) => {
      const next = !v;
      // Exit: reveal landing and scroll to it.
      if (!next) {
        // While exiting, we may still be at scrollY=0 for a beat.
        // Temporarily suppress the scroll-to-top auto-enter behavior.
        exitAutoEnterCooldownUntilRef.current = Date.now() + 1200;
        requestAnimationFrame(() => {
          const el = landingRef.current;
          if (!el) return;
          const landingTop =
            el.getBoundingClientRect().top + (window.scrollY || 0);
          const revealFactor = window.innerWidth <= 520 ? 0.25 : 0.5;
          const target = Math.max(
            0,
            landingTop - window.innerHeight * revealFactor,
          );
          window.scrollTo({ top: target, behavior: "smooth" });
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
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
        if ((window.scrollY || 0) <= 2) {
          enterPlanetarium({ smooth: false });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPlanetarium]);

  const unlockUi = () => {
    setUiUnlocked(true);
    if (uiTimerRef.current) {
      window.clearTimeout(uiTimerRef.current);
      uiTimerRef.current = null;
    }
  };

  const handleSkyLoaded = () => {
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
    return () => {
      if (uiTimerRef.current) window.clearTimeout(uiTimerRef.current);
    };
  }, []);

  return (
    <div className="home">
      <div className="home__stage" ref={stageRef}>
        <GalaxyCanvas
          onConstellationClick={handleConstellationClick}
          forcedProjectionMode={isPlanetarium ? "fill" : undefined}
          onLoaded={handleSkyLoaded}
          onFirstDrag={unlockUi}
          selectedConstellationKeys={selectedConstellationKeys}
        />

        <div
          className="home__stageFade"
          style={{ opacity: isPlanetarium ? 0.25 : 0.9 }}
        />

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

        {isPreviewOpen && constellationPreview && (
          <div
            className="home__constellationPreview"
            role="dialog"
            style={(() => {
              if (!previewAnchorClient || !stageRef.current) return undefined;
              const rect = stageRef.current.getBoundingClientRect();

              // Mobile: keep the preview fully readable and on-screen.
              if (rect.width <= 520) {
                return {
                  left: 14,
                  right: 14,
                  bottom: 74,
                  top: "auto",
                  transform: "none",
                };
              }

              const x = previewAnchorClient.x - rect.left;
              const y = previewAnchorClient.y - rect.top;
              const placeRight = x < rect.width * 0.55;
              const placeDown = y < rect.height * 0.55;
              const tx = placeRight ? "16px" : "calc(-100% - 16px)";
              const ty = placeDown ? "16px" : "calc(-100% - 16px)";
              return {
                left: x,
                top: y,
                transform: `translate(${tx}, ${ty})`,
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
        <section id="intro" className="home__landing" ref={landingRef}>
          <div className="home__nebula home__nebula--a" aria-hidden="true" />
          <div className="home__nebula home__nebula--b" aria-hidden="true" />

          <div className="home__container">
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
                      "a horticulturist",
                      "a linguist",
                      "a mentor",
                      "a ski coach",
                      "a tester",
                      "a traveler",
                      "a inspirer",
                      "a team leader",
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
                  . I build human-centric decision systems at the intersection
                  of Cognitive Science and Computer Science. I do a lot of
                  things and love even more! Welcome to my planetarium
                  portfolio! You can use this site to learn about me, see my
                  projects & research experience, hear what I've been listening
                  to recently, read my thoughts...
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
                    { key: "intro-1", caption: "Add an intro photo here" },
                    {
                      key: "intro-2",
                      caption: "Talk / research / project shot",
                    },
                    {
                      key: "intro-3",
                      caption: "Travel / music / something fun",
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
        </section>
      )}
    </div>
  );
}
