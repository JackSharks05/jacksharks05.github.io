import React from "react";
import "./Page.css";

export default function About() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">About</h1>
        <p className="page__lede">
          A quick intro, what I care about, and what I’m exploring right now.
        </p>
        <div className="page__content">
          <p>
            Replace this with your bio: where you’re based, what you
            study/build, and the through-line connecting your work.
          </p>
          <p>
            You can also link out to your GitHub, LinkedIn, CV, or a longer
            “now” page.
          </p>
        </div>
      </section>
    </div>
  );
}
