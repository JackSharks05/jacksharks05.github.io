import React from "react";
import "./Page.css";

export default function Thoughts() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Thoughts</h1>
        <p className="page__lede">Short essays, notes, links, and ideas.</p>
        <div className="page__content">
          <p>
            If you want this to become a real blog, we can wire up Markdown
            posts next.
          </p>
        </div>
      </section>
    </div>
  );
}
