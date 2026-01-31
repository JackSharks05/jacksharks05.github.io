import React from "react";
import "./Page.css";

export default function ThisSite() {
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
            planetarium on the homepage.
          </p>

          <h2 className="page__sectionTitle">Core pieces</h2>
          <ul className="page__list">
            <li>
              <strong>Planetarium:</strong> Canvas renderer driven by astronomy
              calculations (time + location), with drag controls and
              constellation hit-testing.
            </li>
            <li>
              <strong>Navigation:</strong> a card-based dropdown menu with a
              consistent purple/red outline theme.
            </li>
            <li>
              <strong>Projects:</strong> a scroll-stacked card layout (Lenis) to
              keep the page itself static while the stack animates.
            </li>
            <li>
              <strong>Backgrounds:</strong> shader-driven effects (Galaxy via
              OGL, LightPillar via Three.js) for a cohesive “space” vibe.
            </li>
          </ul>

          <h2 className="page__sectionTitle">Design goals</h2>
          <ul className="page__list">
            <li>Fast, readable, and mobile-friendly.</li>
            <li>Interactive without being noisy.</li>
            <li>One consistent visual system across pages.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
