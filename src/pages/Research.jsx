import React from "react";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import "./Page.css";
import "./Research.css";

export default function Research() {
  return (
    <div className="page">
      <section className="page__card research__pageCard">
        <h1 className="page__title">Research</h1>
        <p className="page__lede">
          I love my research! From behavioral technology and HCI to
          computational linguistics and AI safety — I investigate with rigor,
          curiosity, and passion.
        </p>
        <div className="page__content research__content">
          <ScrollStack
            className="research__stack"
            itemDistance={90}
            itemStackDistance={22}
            baseScale={0.98}
            itemScale={0.01}
            stackPosition="14px"
            scaleEndPosition="0px"
            stopAtEnd
          >
            <ScrollStackItem itemClassName="research__item">
              <div className="research__header">
                <div className="research__heading">
                  <div className="research__titleRow">
                    <h2 className="research__title">
                      Duane Lab (PRIME School of Engineering)
                    </h2>
                    <div className="research__subhead research__subhead--inline">
                      <span className="research__subheadItem">
                        Dates: February 2025–present
                      </span>
                      <span className="research__subheadItem">
                        PI:{" "}
                        <a
                          href="https://www.ja-nae.io/ "
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ja-Naé Duane
                        </a>
                      </span>
                      <span className="research__subheadItem">
                        <a
                          href="https://prime.brown.edu/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lab website
                        </a>
                      </span>
                    </div>
                  </div>
                  <p className="page__meta research__meta">
                    <span className="page__pill">
                      Project Lead &amp; Researcher
                    </span>
                    <span className="page__pill">Behavioral Data Science</span>
                  </p>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/prime.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="research__body">
                <p>
                  <strong>Decoding the Science of Influence.</strong> Since
                  freshman year, I lead a team of graduate researchers
                  investigating “digital nudges”—the subtle interface design
                  choices that shape human decisions. We aren't just running one
                  experiment; we are building a unified theory of ethical choice
                  architecture.
                </p>
                <ul className="page__list">
                  <li>
                    Conducting a massive quantitative meta-analysis of 100+
                    experimental studies to find the "signal" in behavioral
                    noise
                  </li>
                  <li>
                    Developing a standardized data taxonomy to normalize
                    disparate metrics across the field
                  </li>
                  <li>
                    First author on a submitted publication on how to better
                    design nudges for more consistent results
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="research__item">
              <div className="research__header">
                <div className="research__heading">
                  <div className="research__titleRow">
                    <h2 className="research__title">Brown AI Safety Team</h2>
                    <div className="research__subhead research__subhead--inline">
                      <span className="research__subheadItem">
                        Dates: February 2025–present
                      </span>
                      <span className="research__subheadItem">
                        <a
                          href="https://www.baist.ai/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Group website
                        </a>
                      </span>
                    </div>
                  </div>
                  <p className="page__meta research__meta">
                    <span className="page__pill">Technical Fellow</span>
                    <span className="page__pill">Governance</span>
                    <span className="page__pill">Robustness</span>
                    <span className="page__pill">Alignment</span>
                  </p>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/baist.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="research__body">
                <p>
                  <strong>Opening the Black Box.</strong> Modern AI works, but
                  we often don't know <em>how</em>. As a Technical Fellow, I've
                  been investigating the inner workings of Large Language Models
                  to detect failure modes before they happen in the real world.
                </p>
                <ul className="page__list">
                  <li>
                    <strong>Mechanistic Interpretability:</strong> Using sparse
                    autoencoders to map how models represent concepts like
                    "deception" in high-dimensional space
                  </li>
                  <li>
                    <strong>Adversarial Robustness:</strong> Investigating
                    "sleeper agents" (backdoors) and reward hacking in RLHF
                    systems
                  </li>
                  <li>
                    <strong>Governance:</strong> Translating technical risk
                    assessments into safety standards for deployment
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="research__item">
              <div className="research__header">
                <div className="research__heading">
                  <div className="research__titleRow">
                    <h2 className="research__title">
                      Brown Language and Thought Lab
                    </h2>
                    <div className="research__subhead research__subhead--inline">
                      <span className="research__subheadItem">
                        Dates: February 2025–present
                      </span>
                      <span className="research__subheadItem">
                        <a
                          href="https://lailacj.github.io/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PhD Mentor: Laila Johnston
                        </a>
                      </span>
                      <span className="research__subheadItem">
                        <a
                          href="https://sites.brown.edu/bltlab/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lab website
                        </a>
                      </span>
                    </div>
                  </div>
                  <p className="page__meta research__meta">
                    <span className="page__pill">
                      Volunteer Research Assistant
                    </span>
                    <span className="page__pill">
                      Computational Linguistics
                    </span>
                  </p>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/blt.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="research__body">
                <p>
                  <strong>Human vs. Machine Cognition.</strong> Do LLMs actually
                  understand us, or are they just good at guessing? I use
                  computational linguistics to measure the gap between
                  statistical probability and true human intuition.
                </p>
                <ul className="page__list">
                  <li>
                    Investigating the “Relevance Problem” (Frame Problem): How
                    agents determine what information is salient
                  </li>
                  <li>
                    Comparing model "logits" (probability scores) against human
                    performance on linguistic tasks using R and Python
                  </li>
                  <li>
                    Identifying where statistical correlation fails to match
                    human cognitive patterns
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="research__item">
              <div className="research__header">
                <div className="research__heading">
                  <div className="research__titleRow">
                    <h2 className="research__title">
                      Amicus Brain Innovations
                    </h2>
                    <div className="research__subhead research__subhead--inline">
                      <span className="research__subheadItem">
                        Dates: July 2022–August 2024
                      </span>
                      <span className="research__subheadItem">
                        <a
                          href="https://amicusbrain.com/"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Company website
                        </a>
                      </span>
                    </div>
                  </div>
                  <p className="page__meta research__meta">
                    <span className="page__pill">IP R&amp;D Lead</span>
                    <span className="page__pill">Applied GenAI Strategy</span>
                  </p>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/ab.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="research__body">
                <p>
                  <strong>Pioneering GenAI Strategy.</strong> Working on GenAI
                  since 2022, I led R&D to integrate early Large Language Models
                  into caregiver support tools. I bridged the gap between
                  bleeding-edge tech and business strategy.
                </p>
                <ul className="page__list">
                  <li>
                    Benchmarked early models (BLOOM, Bard) to balance token
                    efficiency with reasoning capability for healthcare queries
                  </li>
                  <li>
                    Acted as a "Technical Translator" for the C-Suite, turning
                    complex model limitations into product roadmaps
                  </li>
                  <li>
                    Managed the technical localization strategy to expand into
                    Spanish and French translations of medical responses from
                    the chatbot
                  </li>
                </ul>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </section>
    </div>
  );
}
