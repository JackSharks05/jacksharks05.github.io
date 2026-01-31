import React from "react";
import ImageCarousel from "../components/ImageCarousel";
import "./Page.css";

export default function About() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">About</h1>
        <p className="page__lede">
          Computer Science + Cognitive Science at Brown University (’28). I
          build human-centric decision systems.
        </p>
        <div className="page__content">
          <div className="page__mediaRow">
            <div>
              <p>
                I’m Jack de Haan — a builder with a research mindset. My
                through-line is the intersection of Cognitive Science (how
                humans choose) and Computer Science (how systems enforce and
                scale those choices).
              </p>
              <p>
                I care about shipping real tools, but I’m equally obsessed with
                the “why”: incentives, interfaces, and the hidden decision
                systems that shape outcomes in the real world.
              </p>
            </div>

            <div className="page__mediaAside">
              <ImageCarousel
                className="carousel--portrait"
                ariaLabel="About photos"
                items={[
                  { key: "about-1", caption: "enjoying brown's greenhouse!" },
                  {
                    key: "about-2",
                    caption:
                      "giving the graduation address at Princeton in Beijing 2025",
                  },
                  {
                    key: "about-3",
                    caption: "hiking franconia ridge loop in nov 2025!",
                  },
                ]}
              />
            </div>
          </div>

          <h2 className="page__sectionTitle">Archetypes</h2>
          <ul className="page__list">
            <li>
              <strong>The Force Multiplier</strong> — I don’t just add value; I
              multiply a team’s velocity.
            </li>
            <li>
              <strong>The Process Architect</strong> — I treat products and
              organizations as decision systems you can debug.
            </li>
            <li>
              <strong>The Synthesizer</strong> — I connect ideas across HCI,
              behavioral economics, and system architecture.
            </li>
          </ul>

          <h2 className="page__sectionTitle">Current Focus</h2>
          <ul className="page__list">
            <li>
              Human-centered intelligent systems and ethical choice architecture
            </li>
            <li>AI safety: robustness, interpretability, and alignment</li>
            <li>
              Decision systems for high-stakes, messy, real-world constraints
            </li>
          </ul>

          <h2 className="page__sectionTitle">Skills</h2>
          <div className="page__grid">
            <div className="page__gridItem">
              <div className="page__metaLabel">Programming Languages</div>
              <div className="page__metaValue">
                Python, TypeScript/JavaScript, Java, R, Swift, SQL
              </div>
            </div>
            <div className="page__gridItem">
              <div className="page__metaLabel">Frameworks</div>
              <div className="page__metaValue">
                React, Node.js, Next.js, PyTorch, TensorFlow, scikit-learn
              </div>
            </div>
            <div className="page__gridItem">
              <div className="page__metaLabel">Tools</div>
              <div className="page__metaValue">Git, LaTeX, Tableau, Vercel</div>
            </div>
            <div className="page__gridItem">
              <div className="page__metaLabel">
                Languages (Fluent to Beginner)
              </div>
              <div className="page__metaValue">
                Mandarin, Spanish, French, ASL, German, Italian, Dutch,
                Bulgarian, Cantonese
              </div>
            </div>
          </div>

          <h2 className="page__sectionTitle">Honors (Selected)</h2>
          <ul className="page__list">
            <li>1st place (out of 5,000+) — MIT Mystery Hunt 2026</li>
            <li>2nd place — Tsinghua Inter-University Speech Contest</li>
            <li>Head of School Award, Rye Country Day School (Rye, NY)</li>
            <li>Selected class speaker — Princeton in Beijing</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
