import React, { useEffect, useState } from "react";
import "./Page.css";
import "./Projects.css";
import { Link } from "react-router-dom";

export default function ThisSite() {
  const [showCodeNotice, setShowCodeNotice] = useState(false);
  useEffect(() => {
    if (!showCodeNotice) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCodeNotice(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCodeNotice]);
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">About this site</h1>
        <p className="page__lede">
          A small technical tour of how the portfolio works.
        </p>
        <div className="page__content">
          <p>
            This portfolio is a React + Vite single-page app with a real-time
            planetarium on the homepage. I spent so long scrolling{" "}
            <a
              href="https://reactbits.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              react bits
            </a>{" "}
            to find components I wanted to use--would highly recommend!
          </p>

          <h2 className="page__sectionTitle">Core pieces</h2>
          <ul className="page__list">
            <li>
              <strong>Planetarium:</strong> Canvas renderer driven by astronomy
              calculations (time + loc), with drag controls and clickable
              constellations!
            </li>
            <li>
              <strong>Navigation:</strong> a card-based dropdown menu with a
              consistent purple/red outline theme found throughout the site.
            </li>
            <li>
              <strong>Projects/Research:</strong> a scroll-stacked card layout
              (Lenis) to keep the page itself static while the stack animates.
            </li>
            <li>
              <strong>Backgrounds:</strong> shader-driven effects (Galaxy via
              OGL, LightPillar via Three.js) for a cohesive “space” vibe.
            </li>
          </ul>

          <h2 className="page__sectionTitle">Design goals</h2>
          <ul className="page__list">
            <li>
              Fast, readable (hopefully, if all of my yap doesn't deter you),
              and mobile-friendly.
            </li>
            <li>Interactive and clean.</li>
            <li>One consistent visual system across pages.</li>
            <li>Capture some of my whimsy!</li>
          </ul>

          <h2 className="page__sectionTitle">Data & acknowledgements</h2>
          <ul className="page__list">
            <li>
              <strong>Constellations:</strong> Line art is generated from the
              Stellarium "western" skyculture data and converted into a small
              subset file used by the canvas renderer. After trying to piece the
              constellations together by HIP star ids, Stellarium was actually
              my saviour!
            </li>
            <li>
              <strong>Stars:</strong> Bright stars and constellation endpoints
              are sampled from the HYG Database and bundled into a compact
              catalog for client-side use.
            </li>
            <li>
              <strong>Implementation details:</strong> See the{" "}
              <a onClick={() => setShowCodeNotice(true)}>README&apos;s </a>
              data section for licensing notes.
            </li>
          </ul>
        </div>
      </section>
      {showCodeNotice && (
        <div
          className="projects__popupBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="projects-code-popup-title"
        >
          <div className="projects__popup">
            <h2 id="projects-code-popup-title" className="projects__popupTitle">
              README
            </h2>
            <p className="projects__popupBody">
              Sorry, code is not currently open source. Check back soon!
            </p>
            <button
              type="button"
              className="projects__popupClose"
              onClick={() => setShowCodeNotice(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
