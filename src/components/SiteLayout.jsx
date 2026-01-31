import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import CardNav from "./CardNav";
import Dock from "./Dock";
import starPng from "../assets/star.png";
import starSvg from "../assets/star.svg";
import "./SiteLayout.css";

export default function SiteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const [planetariumActive, setPlanetariumActive] = useState(false);
  const [planetariumHintDismissed, setPlanetariumHintDismissed] =
    useState(false);
  const brandPanelRef = useRef(null);
  const [navWidthPx, setNavWidthPx] = useState(null);

  const [logoSrc, setLogoSrc] = useState(starPng);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onPlanetariumEnter = () => setNavOpen(false);
    const onConstellationActivated = () => setPlanetariumHintDismissed(true);
    window.addEventListener("planetarium:enter", onPlanetariumEnter);
    window.addEventListener(
      "constellation:activated",
      onConstellationActivated,
    );
    return () => {
      window.removeEventListener("planetarium:enter", onPlanetariumEnter);
      window.removeEventListener(
        "constellation:activated",
        onConstellationActivated,
      );
    };
  }, []);

  useEffect(() => {
    const onPlanetariumState = (e) => {
      const next = Boolean(e?.detail?.isPlanetarium);
      setPlanetariumActive(next);
      if (next) setNavOpen(false);
    };
    window.addEventListener("planetarium:state", onPlanetariumState);
    return () =>
      window.removeEventListener("planetarium:state", onPlanetariumState);
  }, []);

  useEffect(() => {
    const el = brandPanelRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const margin = window.innerWidth <= 760 ? 28 : 44;
      const max = Math.max(0, window.innerWidth - margin);
      setNavWidthPx(Math.min(Math.round(rect.width), Math.round(max)));
    };

    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    }

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect?.();
    };
  }, []);

  useEffect(() => {
    // Leaving Home should always re-enable the dock.
    if (!isHome) setPlanetariumActive(false);
  }, [isHome]);

  useEffect(() => {
    // If a navigation explicitly requests planetarium, auto-close the menu.
    if (!isHome) return;
    if (location?.state?.enterPlanetarium) setNavOpen(false);
  }, [isHome, location.key, location.state]);

  const showDock = !isHome || !planetariumActive;
  const showPlanetariumHintContainer = isHome && planetariumActive;
  const showPlanetariumHintText =
    showPlanetariumHintContainer && !planetariumHintDismissed;

  // IMPORTANT: memoize items so CardNav's GSAP timeline isn't recreated every render.
  const navItems = useMemo(
    () => [
      {
        label: "About",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/about",
      },
      {
        label: "Now",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/now",
      },
      {
        label: "Projects",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/projects",
      },
      {
        label: "Research",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/research",
      },
      {
        label: "Music",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/music",
      },
      {
        label: "Thoughts",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/thoughts",
      },
      {
        label: "Photo/Video",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/photography-videography",
      },
      {
        label: "Resume",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/resume",
      },
      {
        label: "Contact",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/contact",
      },
    ],
    [],
  );

  return (
    <div
      className={
        isHome
          ? showDock
            ? "site-shell is-home has-dock"
            : "site-shell is-home"
          : showDock
            ? "site-shell has-dock"
            : "site-shell"
      }
    >
      <header className="site-header">
        <div className="header-left">
          <div
            ref={brandPanelRef}
            className="brandPanel"
            aria-label="Site header"
          >
            <button
              type="button"
              className={navOpen ? "site-menu-btn is-open" : "site-menu-btn"}
              onClick={() => setNavOpen((v) => !v)}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
            >
              <img
                className="site-menu-btn__icon"
                src={logoSrc}
                alt="Menu"
                onError={() => setLogoSrc(starSvg)}
              />
            </button>

            <Link
              to="/"
              state={{ enterPlanetarium: true }}
              className="brandHome"
              aria-label="Home"
              onClick={() => {
                // If we're already on Home, the route may not remount. Fire a
                // lightweight event so Home can re-enter planetarium reliably.
                window.dispatchEvent(
                  new CustomEvent("planetarium:enter", {
                    detail: { source: "brand" },
                  }),
                );
              }}
            >
              <div className="brand__text">
                <div className="brand__name">Jack de Haan</div>
                <div className="brand__tag">Portfolio</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="header-right">
          {showPlanetariumHintContainer && (
            <div
              className={
                showPlanetariumHintText
                  ? "header-hint"
                  : "header-hint is-hidden"
              }
            >
              Hover constellations or use the cards
            </div>
          )}
        </div>
      </header>

      <div
        className="site-nav"
        style={navWidthPx ? { width: `${navWidthPx}px` } : undefined}
      >
        <CardNav
          logo={logoSrc}
          logoAlt="Star logo"
          className="card-nav--dropdown"
          expanded={navOpen}
          collapsedHeight={0}
          items={navItems}
          baseColor="#000"
          menuColor="#000"
          buttonBgColor="#000"
          buttonTextColor="#fff"
          ease="power3.out"
          theme="dark"
        />
      </div>

      <main className={isHome ? "site-main is-home" : "site-main"}>
        <Outlet />
      </main>

      {showDock && (
        <Dock
          items={[
            {
              key: "planetarium",
              label: "Back to planetarium",
              ariaLabel: "Back to planetarium",
              isActive: isHome,
              onClick: () => {
                if (isHome) {
                  window.dispatchEvent(
                    new CustomEvent("planetarium:intro", {
                      detail: { source: "dock" },
                    }),
                  );
                  return;
                }
                navigate("/", { state: { openIntro: true } });
              },
            },
            {
              key: "this-site",
              label: "This site",
              ariaLabel: "About this site",
              isActive: location.pathname === "/this-site",
              onClick: () => navigate("/this-site"),
            },
            {
              key: "about",
              label: "About",
              ariaLabel: "Go to About",
              isActive: location.pathname === "/about",
              onClick: () => navigate("/about"),
            },
            {
              key: "contact",
              label: "Contact",
              ariaLabel: "Go to Contact",
              isActive: location.pathname === "/contact",
              onClick: () => navigate("/contact"),
            },
          ]}
        />
      )}
    </div>
  );
}
