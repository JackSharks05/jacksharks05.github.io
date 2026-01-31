import React from "react";
import LightPillar from "../components/LightPillar";
import "./Page.css";
import "./Now.css";

export default function Now() {
  return (
    <div className="page">
      <section className="page__card now">
        <div className="now__bg" aria-hidden="true">
          <LightPillar
            bottomColor="#621F6D"
            topColor="#FE0000"
            intensity={0.95}
            rotationSpeed={0.35}
            glowAmount={0.006}
            noiseIntensity={0.45}
            pillarWidth={3.2}
            pillarHeight={0.45}
            pillarRotation={18}
            quality="medium"
          />
          <div className="now__veil" />
        </div>

        <div className="now__content">
          <h1 className="page__title">Now</h1>
          <p className="page__lede">What I’m focused on right now.</p>
          <div className="page__content">
            <p>
              This page is a snapshot — I’ll keep it updated as my priorities
              shift.
            </p>
            <ul className="page__list">
              <li>Building human-centered decision systems</li>
              <li>AI safety: interpretability, robustness, and alignment</li>
              <li>Shipping tools that reduce friction for real users</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
