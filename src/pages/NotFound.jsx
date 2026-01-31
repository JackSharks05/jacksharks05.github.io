import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Galaxy from "../components/Galaxy";
import "./NotFoundFull.css";

export default function NotFound() {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("planetarium:404", { detail: { active: true } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent("planetarium:404", { detail: { active: false } }),
      );
    };
  }, []);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="notFound">
      <Galaxy
        className="notFound__bg"
        transparent
        mouseInteraction
        glowIntensity={0.35}
        twinkleIntensity={0.35}
        rotationSpeed={0.08}
        density={1}
        hueShift={160}
      />

      <div className="notFound__veil" />

      <div className="notFound__content">
        <div className="notFound__badge">jack de haan</div>
        <h1 className="notFound__title">404</h1>
        <p className="notFound__subtitle">
          that page doesnt exist... just yet! head back <Link to="/">home</Link>
          .
        </p>
      </div>
    </div>
  );
}
