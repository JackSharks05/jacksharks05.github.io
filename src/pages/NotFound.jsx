import React from "react";
import { Link } from "react-router-dom";
import "./Page.css";

export default function NotFound() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">where in the universe are you?</h1>
        <p className="page__lede">that page doesn’t exist... just yet!</p>
        <div className="page__content">
          <p>
            head back <Link to="/">home</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
