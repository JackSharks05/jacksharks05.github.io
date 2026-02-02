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

          <h2 className="page__sectionTitle">Data & acknowledgements</h2>
          <ul className="page__list">
            <li>
              <strong>Constellations:</strong> Line art is generated from the
              Stellarium "western" skyculture data and converted into a small
              subset file used by the canvas renderer.
            </li>
            <li>
              <strong>Stars:</strong> Bright stars and constellation endpoints
              are sampled from the HYG Database and bundled into a compact
              catalog for client-side use.
            </li>
            <li>
              <strong>Implementation details:</strong> See the README&apos;s
              data section for licensing notes, regeneration scripts, and links
              back to the upstream projects.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
