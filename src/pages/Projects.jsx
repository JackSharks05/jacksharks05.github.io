import React from "react";
import "./Page.css";

export default function Projects() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Projects</h1>
        <p className="page__lede">
          Selected work — with links, screenshots, demos.
        </p>
        <div className="page__content">
          <p>
            Add project cards here (name, short pitch, stack, link to
            repo/demo).
          </p>
        </div>
      </section>
    </div>
  );
}
