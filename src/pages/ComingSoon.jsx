import React from "react";
import Galaxy from "../components/Galaxy";
import "./ComingSoon.css";

export default function ComingSoon() {
  return (
    <div className="comingSoon">
      <Galaxy
        className="comingSoon__bg"
        transparent
        mouseInteraction
        glowIntensity={0.35}
        twinkleIntensity={0.35}
        rotationSpeed={0.08}
        density={1}
        hueShift={160}
      />

      <div className="comingSoon__veil" />

      <div className="comingSoon__content">
        <div className="comingSoon__badge">Jack DeHaan</div>
        <h1 className="comingSoon__title">Coming soon</h1>
        <p className="comingSoon__subtitle">
          This site is under construction. Check back soon.
        </p>
      </div>
    </div>
  );
}
