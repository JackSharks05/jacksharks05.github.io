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
            Sorry! I've removed my résumé from here to prevent scraping, but you
            (if you're not a bot) are more than welcome to explore the site to
            learn about what I do, or email me to{" "}
            <a href="mailto:contact@jackdehaan.com?subject=R%C3%A9sum%C3%A9%20request&body=Hi%20Jack!%0A%0AI'm%20%3Cname%3E%2C%20a%20%3Ctitle%3E%20at%20%3Clocation%3E%2C%20and%20I'd%20love%20to%20get%20a%20copy%20of%20your%20r%C3%A9sum%C3%A9%20for%20%3Creason%3E.%20%3Cmore%20information%3E%0A%0ATake%20care%2C%0A%3Cname%3E">
              request one
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
