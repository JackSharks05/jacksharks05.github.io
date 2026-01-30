import React from "react";
import "./Page.css";

export default function Resume() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Resume</h1>
        <p className="page__lede">Experience, skills, and education.</p>
        <div className="page__content">
          <p>
            Add your resume details here. If you have a PDF, we can add a
            download link and an embedded viewer.
          </p>
        </div>
      </section>
    </div>
  );
}
