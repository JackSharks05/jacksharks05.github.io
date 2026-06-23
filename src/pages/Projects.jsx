import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import ImageCarousel from "../components/ImageCarousel";
import "./Page.css";
import "./Projects.css";

export default function Projects() {
  const [showCodeNotice, setShowCodeNotice] = useState(false);

  useEffect(() => {
    if (!showCodeNotice) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowCodeNotice(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCodeNotice]);

  return (
    <div className="page">
      <section className="page__card projects__pageCard">
        <h1 className="page__title">Projects</h1>
        <p className="page__lede">
          My builder portfolio! Mostly technical projects I've worked on in the
          last few years.
        </p>
        <div className="page__content projects__content">
          <ScrollStack
            className="projects__stack"
            itemDistance={90}
            itemStackDistance={22}
            baseScale={0.98}
            itemScale={0.01}
            stackPosition="14px"
            scaleEndPosition="0px"
            stopAtEnd
          >
            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__layout">
                <div className="projects__layoutMain">
                  <div className="projects__header">
                    <h2 className="projects__title">
                      Planetarium Portfolio (this site!)
                    </h2>
                    <div className="projects__links">
                      {/* <a
                        className="projects__linkBtn"
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                      > */}
                      <button
                        type="button"
                        className="projects__linkBtn"
                        onClick={() => setShowCodeNotice(true)}
                      >
                        Github
                      </button>
                      <Link className="projects__linkBtn" to="/this-site">
                        About
                      </Link>
                    </div>
                  </div>

                  <p className="page__meta">
                    <span className="page__pill">React</span>
                    <span className="page__pill">Vite</span>
                    <span className="page__pill">Canvas</span>
                    <span className="page__pill">OGL</span>
                    <span className="page__pill">Three.js</span>
                  </p>

                  <div className="projects__body">
                    <p>
                      A portfolio built like a tiny interactive product: an
                      accurate planetarium, shader-driven backgrounds, and a
                      card-based navigation system. I spent <em>way </em>
                      too long overengineering this.
                    </p>
                    <ul className="page__list">
                      <li>
                        Homepage planetarium rendered in real time with accurate
                        plotting of stars and constellation interaction.
                      </li>
                      <li>
                        Scroll-stacked project cards with (kinda) smooth
                        internal scrolling.
                      </li>
                      <li>Consistent theme system with my favourite colors!</li>
                    </ul>
                  </div>
                </div>

                <div className="projects__layoutMedia">
                  <div className="projects__media">
                    <ImageCarousel
                      className="projects__carousel"
                      items={[
                        {
                          key: "thissite-1",
                          src: "/media/photos/planetarium1.png",
                          alt: "Planetarium homepage",
                          caption: "Interactive star map!",
                        },
                        {
                          key: "thissite-2",
                          src: "/media/photos/planetarium2.png",
                          alt: "Scroll-stacked navigation",
                          caption: "About page with fancy React components!",
                        },
                        {
                          key: "thissite-3",
                          src: "/media/photos/planetarium3.png",
                          alt: "Project showcase",
                          caption: "This page! Wait...",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__layout">
                <div className="projects__layoutMain">
                  <div className="projects__header">
                    <h2 className="projects__title">C@Bnet</h2>
                    <div className="projects__links">
                      {/* <a
                        className="projects__linkBtn"
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                      > */}
                      <button
                        type="button"
                        className="projects__linkBtn"
                        onClick={() => setShowCodeNotice(true)}
                      >
                        GitHub
                      </button>
                      {/* </a> */}
                    </div>
                  </div>

                  <p className="page__meta">
                    <span className="page__pill">
                      Product Lead & Strategist
                    </span>
                    <span className="page__pill">TypeScript</span>
                    <span className="page__pill">React</span>
                    <span className="page__pill">Node.js</span>
                    <span className="page__pill">Chrome Extension</span>
                  </p>

                  <div className="projects__body">
                    <p>
                      Brown’s course registration system (C@B) serves 12,000+
                      students and faculty, but the workflow was fragmented:
                      outdated UI, scattered data sources, and slow search.
                    </p>
                    <ul className="page__list">
                      <li>
                        Interviewed admins and students as stakeholders; mapped
                        key flaws with the system to potential solutions.
                      </li>
                      <li>
                        Integrated information about concentrations,
                        requirements, and course rating data all on the
                        registration page.
                      </li>
                      <li>
                        Built a weighted recommendation engine from peer
                        advising principles, targeted for first & second years.
                      </li>
                      <li>
                        Shipped a Chrome browser extension, currently beta
                        testing.
                      </li>
                    </ul>
                    {/* <p className="page__callout">
                      Outcome: deployed to the entire student body; reduced
                      time-to-decision for course planning.
                    </p> */}
                  </div>
                </div>

                <div className="projects__layoutMedia">
                  <div className="projects__media">
                    <ImageCarousel
                      className="projects__carousel"
                      items={[
                        {
                          key: "cabnet-1",
                          src: "/media/photos/cabnet1.png",
                          alt: "Side panel with concentration pathways",
                          caption: "Concentration pathways",
                        },
                        {
                          key: "cabnet-2",
                          src: "/media/photos/cabnet2.png",
                          alt: "Showing the course ratings overlayed on course listings.",
                          caption: "Course ratings (actual ratings hidden)",
                        },
                        {
                          key: "cabnet-3",
                          src: "/media/photos/cabnet3.png",
                          alt: "Showing warning icons overlayed on course listings",
                          caption:
                            "Colored warning icons, custom recommendations, and more!",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__layout">
                <div className="projects__layoutMain">
                  <div className="projects__header">
                    <h2 className="projects__title">
                      Brown Puzzle Hunt Platform (bph-site)
                    </h2>
                    <div className="projects__links">
                      <a
                        className="projects__linkBtn"
                        href="https://github.com/brown-puzzle-hq/bph-site"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>

                  <p className="page__meta">
                    <span className="page__pill">Event Lead & Tech Team</span>
                    <span className="page__pill">TypeScript</span>
                    <span className="page__pill">Next.js</span>
                    <span className="page__pill">Vercel</span>
                    <span className="page__pill">Drizzle ORM</span>
                  </p>

                  <div className="projects__body">
                    <p>
                      A three-day puzzle hunt with ~1,000 active participants is
                      basically a live distributed system: concurrency spikes,
                      websockets, and zero tolerance for downtime.
                    </p>
                    <ul className="page__list">
                      <li>
                        Contributed to the full-stack platform: authentication,
                        teams, submissions, unlock logic.
                      </li>
                      <li>
                        Load-tested and hardened edge cases for “rush” moments
                        (start/end of hunt).
                      </li>
                      <li>
                        Built interactive map to guide solvers through the
                        rounds.
                      </li>
                      <li>
                        Open-sourced the core infrastructure; later adopted by
                        MIT Mystery Hatch.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="projects__layoutMedia">
                  <div className="projects__media">
                    <ImageCarousel
                      className="projects__carousel"
                      items={[
                        {
                          key: "bph-1",
                          src: "/media/photos/bph1.png",
                          alt: "Landing page",
                          caption: "Landing page with parallax effects",
                        },
                        {
                          key: "bph-2",
                          src: "/media/photos/bph2.png",
                          alt: "Puzzle Map",
                          caption:
                            "Map with layout of all of the puzzles and rounds",
                        },
                        {
                          key: "bph-3",
                          src: "/media/photos/bph3.png",
                          alt: "Internal view of puzzles",
                          caption: "Puzzle dependency graph",
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__layout">
                <div className="projects__layoutMain">
                  <div className="projects__header">
                    <h2 className="projects__title">WatchYourCalendar</h2>
                    <div className="projects__links">
                      <a
                        className="projects__linkBtn"
                        href="https://github.com/CilantroMalik/WatchYourCalendar"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>

                  <p className="page__meta">
                    <span className="page__pill">iOS / watchOS Developer</span>
                    <span className="page__pill">Swift</span>
                    <span className="page__pill">watchOS</span>
                    <span className="page__pill">EventKit</span>
                  </p>

                  <div className="projects__body">
                    <p>
                      A pet project to make a centralized scheduling system on
                      the Apple Watch for a busy school day and also to learn
                      Swift!
                    </p>
                    <ul className="page__list">
                      <li>
                        Self-taught Swift + watchOS and shipped a usable
                        product.
                      </li>
                      <li>Later, added calendar integration with iPhone.</li>
                      <li>
                        Support for watchface complications, event scheduling,
                        and notifications.
                      </li>
                      <li>Beta-tested with and iterated on UI/UX friction.</li>
                    </ul>
                  </div>
                </div>

                <div className="projects__layoutMedia">
                  <div className="projects__media projects__media--video">
                    <div className="projects__mediaVideo">
                      <iframe
                        src="https://www.youtube.com/embed/abXyBG8DRPg"
                        title="WatchYourCalendar demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <div className="projects__mediaCaption">Use captions!</div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__layout">
                <div className="projects__layoutMain">
                  <div className="projects__header">
                    <h2 className="projects__title">Puzzles</h2>
                  </div>

                  <div className="projects__body">
                    <p>
                      A collection of puzzles I&apos;ve written: currently, all
                      here are from Brown Puzzle Hunt 2025!
                    </p>
                    <ul className="page__list">
                      <li>
                        I&apos;ll add a list of puzzle titles here, each with a
                        link.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="projects__layoutMedia">
                  <div className="projects__media">
                    <div className="projects__mediaPlaceholder">
                      Will be adding my favourites soon...
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </section>

      {showCodeNotice && (
        <div
          className="projects__popupBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="projects-code-popup-title"
        >
          <div className="projects__popup">
            <h2 id="projects-code-popup-title" className="projects__popupTitle">
              Source code
            </h2>
            <p className="projects__popupBody">
              Code is not currently open source. Check back soon!
            </p>
            <button
              type="button"
              className="projects__popupClose"
              onClick={() => setShowCodeNotice(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
