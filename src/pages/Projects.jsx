import React from "react";
import { Link } from "react-router-dom";
import ScrollStack, { ScrollStackItem } from "../components/ScrollStack";
import ImageCarousel from "../components/ImageCarousel";
import "./Page.css";
import "./Projects.css";

export default function Projects() {
  return (
    <div className="page">
      <section className="page__card projects__pageCard">
        <h1 className="page__title">Projects</h1>
        <p className="page__lede">
          Builder portfolio — products that ship, scale, and reduce friction.
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
              <div className="projects__header">
                <h2 className="projects__title">This Site</h2>
                <div className="projects__links">
                  <a
                    className="projects__linkBtn"
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                  <Link className="projects__linkBtn" to="/this-site">
                    About this site
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

              <div className="projects__media">
                <ImageCarousel
                  className="projects__carousel"
                  items={[
                    {
                      key: "thissite-1",
                      alt: "Planetarium homepage",
                      caption: "Interactive star map",
                    },
                    {
                      key: "thissite-2",
                      alt: "Card navigation",
                      caption: "Smooth scroll stacks",
                    },
                    {
                      key: "thissite-3",
                      alt: "Project showcase",
                      caption: "Constellation interaction",
                    },
                  ]}
                />
              </div>

              <div className="projects__body">
                <p>
                  A portfolio built like a tiny interactive product: an accurate
                  planetarium, shader-driven backgrounds, and a card-based
                  navigation system.
                </p>
                <ul className="page__list">
                  <li>
                    Homepage planetarium rendered in real time with
                    constellation interaction.
                  </li>
                  <li>
                    Scroll-stacked project cards with smooth internal scrolling.
                  </li>
                  <li>
                    Consistent theme system (purple outer / red inner outlines).
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__header">
                <h2 className="projects__title">C@Bnet</h2>
                <div className="projects__links">
                  {/* <a
                    className="projects__linkBtn"
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                  > */}
                  <a className="projects__linkBtn">
                    Code is not currently open source. Check back soon!
                  </a>
                  {/* </a> */}
                </div>
              </div>

              <p className="page__meta">
                <span className="page__pill">Product Lead & Strategist</span>
                <span className="page__pill">TypeScript</span>
                <span className="page__pill">React</span>
                <span className="page__pill">Node.js</span>
                <span className="page__pill">Chrome Extension</span>
              </p>

              <div className="projects__media">
                <ImageCarousel
                  className="projects__carousel"
                  items={[
                    {
                      key: "cabnet-1",
                      alt: "Course catalog interface",
                      caption: "Enhanced search",
                    },
                    {
                      key: "cabnet-2",
                      alt: "Prerequisite visualization",
                      caption: "Course dependencies",
                    },
                    {
                      key: "cabnet-3",
                      alt: "Concentration paths",
                      caption: "85+ pathways",
                    },
                  ]}
                />
              </div>

              <div className="projects__body">
                <p>
                  Brown’s course registration system serves 12,000+ students and
                  faculty, but the workflow was fragmented: outdated UI,
                  scattered data sources, and slow search.
                </p>
                <ul className="page__list">
                  <li>
                    Treated admins and students as stakeholders; mapped “jobs to
                    be done” via interviews.
                  </li>
                  <li>
                    Reverse-engineered legacy data into a navigable course
                    graph.
                  </li>
                  <li>
                    Built a weighted recommendation engine that approximates
                    peer advising (prereqs, grade distributions, concentration
                    rules).
                  </li>
                  <li>
                    Shipped a browser extension overlay: ratings, prerequisite
                    chains, and 85+ concentration path visualizations.
                  </li>
                </ul>
                <p className="page__callout">
                  Outcome: deployed to the entire student body; reduced
                  time-to-decision for course planning.
                </p>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__header">
                <h2 className="projects__title">
                  Brown Puzzle Hunt Platform (bph-site)
                </h2>
                <div className="projects__links">
                  <a
                    className="projects__linkBtn"
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              <p className="page__meta">
                <span className="page__pill">Lead Developer & Event Lead</span>
                <span className="page__pill">TypeScript</span>
                <span className="page__pill">Next.js</span>
                <span className="page__pill">Vercel</span>
                <span className="page__pill">Drizzle ORM</span>
              </p>

              <div className="projects__media">
                <ImageCarousel
                  className="projects__carousel"
                  items={[
                    {
                      key: "bph-1",
                      alt: "Puzzle hunt homepage",
                      caption: "Team dashboard",
                    },
                    {
                      key: "bph-2",
                      alt: "Puzzle interface",
                      caption: "Submission system",
                    },
                    {
                      key: "bph-3",
                      alt: "Leaderboard view",
                      caption: "Real-time rankings",
                    },
                  ]}
                />
              </div>

              <div className="projects__body">
                <p>
                  A three-day puzzle hunt with ~1,000 active participants is
                  basically a live distributed system: concurrency spikes,
                  strict correctness, and zero tolerance for downtime.
                </p>
                <ul className="page__list">
                  <li>
                    Built the full-stack platform: authentication, teams,
                    submissions, unlock logic.
                  </li>
                  <li>
                    Load-tested and hardened edge cases for “rush” moments
                    (start/end of hunt).
                  </li>
                  <li>Responsive UI for mobile + desktop solvers.</li>
                  <li>
                    Open-sourced the core infrastructure; later adopted by MIT
                    Mystery Hatch.
                  </li>
                </ul>
              </div>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="projects__item">
              <div className="projects__header">
                <h2 className="projects__title">WatchYourCalendar</h2>
                <div className="projects__links">
                  <a
                    className="projects__linkBtn"
                    href="https://github.com/"
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

              <div className="projects__media">
                <ImageCarousel
                  className="projects__carousel"
                  items={[
                    {
                      key: "wyc-1",
                      alt: "Apple Watch calendar",
                      caption: "Next class view",
                    },
                    {
                      key: "wyc-2",
                      alt: "Schedule complication",
                      caption: "Watch face integration",
                    },
                    {
                      key: "wyc-3",
                      alt: "Booking interface",
                      caption: "Conference scheduling",
                    },
                  ]}
                />
              </div>

              <div className="projects__body">
                <p>
                  When my high school introduced a strict no-phone policy, it
                  broke a core workflow: students lost access to schedules and
                  bookings. The Apple Watch was the only compliant device.
                </p>
                <ul className="page__list">
                  <li>
                    Self-taught Swift + watchOS in two weeks and shipped a
                    usable product.
                  </li>
                  <li>Calendar integration with “Next Class” complications.</li>
                  <li>
                    Teacher conference booking + assessment scheduling views.
                  </li>
                  <li>
                    Beta-tested with ~20 users, iterated on UI/UX friction.
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
