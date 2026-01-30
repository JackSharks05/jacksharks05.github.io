import React from "react";
import "./Page.css";

export default function Contact() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Contact</h1>
        <p className="page__lede">Email, socials, and a simple contact form.</p>
        <div className="page__content">
          <p>
            Add your preferred contact links here (email, LinkedIn, GitHub,
            Instagram, etc.).
          </p>
        </div>
      </section>
    </div>
  );
}
