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
          Behavioral data science, HCI, and AI safety — built with rigor.
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
                    <div className="research__subhead">
                      <span className="research__subheadItem">
                        Dates: (add dates)
                      </span>
                      <span className="research__subheadItem">
                        PI: (add PI)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/duane-lab.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="page__meta">
                <span className="page__pill">Project Lead & Researcher</span>
                <span className="page__pill">Behavioral Data Science</span>
              </p>
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
                    Built a unified taxonomy to normalize metrics (conversion,
                    time-on-task, error rates)
                  </li>
                  <li>
                    Mapped correlations between nudge types (social proof,
                    scarcity) and outcomes
                  </li>
                </ul>
                <p className="page__callout">
                  Output: first-author submission to Behaviour & Information
                  Technology.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="research__item">
              <div className="research__header">
                <div className="research__heading">
                  <div className="research__titleRow">
                    <h2 className="research__title">Brown AI Safety Team</h2>
                    <div className="research__subhead">
                      <span className="research__subheadItem">
                        Dates: (add dates)
                      </span>
                      <span className="research__subheadItem">
                        PI: (add PI)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/brown-ai-safety.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="page__meta">
                <span className="page__pill">Technical Fellow</span>
                <span className="page__pill">Governance</span>
                <span className="page__pill">Robustness</span>
                <span className="page__pill">Alignment</span>
              </p>
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
                    <div className="research__subhead">
                      <span className="research__subheadItem">
                        Dates: (add dates)
                      </span>
                      <span className="research__subheadItem">
                        PI: (add PI)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/brown-language-thought.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="page__meta">
                <span className="page__pill">Research Assistant</span>
                <span className="page__pill">Computational Linguistics</span>
              </p>
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
                    <h2 className="research__title">Amicus Brain Innovations</h2>
                    <div className="research__subhead">
                      <span className="research__subheadItem">
                        Dates: (add dates)
                      </span>
                      <span className="research__subheadItem">
                        PI: (add PI)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="research__logoWrap" aria-hidden="true">
                  <img
                    className="research__logo"
                    src="/media/logos/amicus.png"
                    alt=""
                    loading="lazy"
                  />
                </div>
              </div>
              <p className="page__meta">
                <span className="page__pill">IP R&D Lead</span>
                <span className="page__pill">Applied GenAI (2022–2024)</span>
              </p>
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
