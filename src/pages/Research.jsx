import React from "react";
import "./Page.css";

export default function Research() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Research</h1>
        <p className="page__lede">
          Topics, papers, notes, and ongoing questions.
        </p>
        <div className="page__content">
          <p>Drop in abstracts, PDFs, posters, or reading lists.</p>
        </div>
      </section>
    </div>
  );
}
