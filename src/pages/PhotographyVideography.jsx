import React from "react";
import "./Page.css";

export default function PhotographyVideography() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Photography &amp; Videography</h1>
        <p className="page__lede">
          A place for galleries, reels, and highlights.
        </p>
        <div className="page__content">
          <p>
            Add a grid of images/videos here. If you want, I can set up a simple
            gallery component with lightbox + tags.
          </p>
        </div>
      </section>
    </div>
  );
}
