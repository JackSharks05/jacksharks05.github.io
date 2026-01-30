import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import CardNav from "./CardNav";
import starPng from "../assets/star.png";
import starSvg from "../assets/star.svg";
import "./SiteLayout.css";

export default function SiteLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [logoSrc, setLogoSrc] = useState(starPng);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    // Close the dropdown when navigating.
    setNavOpen(false);
  }, [location.pathname]);

  // IMPORTANT: memoize items so CardNav's GSAP timeline isn't recreated every render.
  const navItems = useMemo(
    () => [
      {
        label: "About",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/about",
        links: [
          { label: "Bio", ariaLabel: "About bio" },
          { label: "Now", ariaLabel: "About now" },
        ],
      },
      {
        label: "Projects",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/projects",
        links: [
          { label: "Featured", ariaLabel: "Featured projects" },
          { label: "Case Studies", ariaLabel: "Project case studies" },
        ],
      },
      {
        label: "Research",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/research",
        links: [
          { label: "Papers", ariaLabel: "Research papers" },
          { label: "Notes", ariaLabel: "Research notes" },
        ],
      },
      {
        label: "Music",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/music",
        links: [
          { label: "Releases", ariaLabel: "Music releases" },
          { label: "Clips", ariaLabel: "Music clips" },
        ],
      },
      {
        label: "Thoughts",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/thoughts",
        links: [
          { label: "Essays", ariaLabel: "Thought essays" },
          { label: "Notes", ariaLabel: "Thought notes" },
        ],
      },
      {
        label: "Photo/Video",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/photography-videography",
        links: [
          { label: "Photography", ariaLabel: "Photography" },
          { label: "Videography", ariaLabel: "Videography" },
        ],
      },
      {
        label: "Resume",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/resume",
        links: [
          { label: "Experience", ariaLabel: "Resume experience" },
          { label: "Skills", ariaLabel: "Resume skills" },
        ],
      },
      {
        label: "Contact",
        bgColor: "#0E0E10",
        textColor: "#fff",
        to: "/contact",
        links: [
          { label: "Email", ariaLabel: "Email" },
          { label: "LinkedIn", ariaLabel: "LinkedIn" },
        ],
      },
    ],
    [],
  );

  return (
    <div className={isHome ? "site-shell is-home" : "site-shell"}>
      <header className="site-header">
        <div className="header-left">
          <div className="brandPanel" aria-label="Site header">
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
          <div className="header-hint">
            {isHome
              ? "Hover constellations or use the cards"
              : "Navigate with the cards"}
          </div>
        </div>
      </header>

      <div className="site-nav">
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
    </div>
  );
}
