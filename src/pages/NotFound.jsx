import React from "react";
import { Link } from "react-router-dom";
import "./Page.css";

export default function NotFound() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">404</h1>
        <p className="page__lede">That page doesn’t exist.</p>
        <div className="page__content">
          <p>
            Head back <Link to="/">home</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
