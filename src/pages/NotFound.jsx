import React from "react";
import { Link } from "react-router-dom";
import Galaxy from "../components/Galaxy";
import "./Page.css";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page">
      <section className="page__card notFound">
        <div className="notFound__bg" aria-hidden="true">
          <Galaxy
            transparent
            mouseInteraction
            glowIntensity={0.35}
            twinkleIntensity={0.35}
            rotationSpeed={0.08}
            density={1}
            hueShift={160}
          />
          <div className="notFound__veil" />
        </div>

        <div className="notFound__content">
          <h1 className="page__title">404</h1>
          <p className="page__lede">where in the universe are you!?</p>
          <div className="page__content">
            <p>
              that page doesn’t exist... just yet! <br></br>
              <br></br> head back <Link to="/">home</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
