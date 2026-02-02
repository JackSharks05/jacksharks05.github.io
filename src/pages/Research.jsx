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
                          href="https://replace-with-duane-lab-url.example"
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
                  I lead research on “digital nudges” — how interface design
                  choices shape user decisions in high-stakes environments.
                </p>
                <ul className="page__list">
                  <li>
                    Quantitative meta-analysis across 100+ experimental studies
                  </li>
                  <li>
                    Built a unified taxonomy to normalize design to maximize
                    effects
                  </li>
                  <li>
                    Leading a team of graduate students with backgrounds from
                    behavioral science to business technology
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
                <ul className="page__list">
                  <li>
                    Mechanistic interpretability: superposition, sparse
                    autoencoders, feature representations
                  </li>
                  <li>
                    Probing: linear probes over activation vectors to elicit
                    latent knowledge
                  </li>
                  <li>
                    Robustness: sleeper agents/backdoors and reward hacking in
                    RLHF
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
                  I work on the “relevance problem” (frame problem): how models
                  decide what information is salient.
                </p>
                <ul className="page__list">
                  <li>
                    Compared LLM outputs (BERT/GPT-style) against human
                    behavioral data using R and Python
                  </li>
                  <li>
                    Analyzed logits to predict human cloze-task performance and
                    ambiguity handling
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
                    <span className="page__pill">
                      Applied GenAI (2022–2024)
                    </span>
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
                <ul className="page__list">
                  <li>
                    Evaluated early GenAI stacks and benchmarked tradeoffs
                    (token efficiency vs reasoning) for specialized healthcare
                    queries
                  </li>
                  <li>
                    Presented risk-aware technical roadmaps to executives;
                    translated model limitations into business constraints
                  </li>
                  <li>
                    Managed localization strategy for Spanish/French markets
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
