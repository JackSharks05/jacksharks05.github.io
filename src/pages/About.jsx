import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import "./Page.css";
import "./Projects.css";

export default function About() {
  const [showEnergyPopup, setShowEnergyPopup] = useState(false);
  useEffect(() => {
    if (!showEnergyPopup) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowEnergyPopup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showEnergyPopup]);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  useEffect(() => {
    if (!showLanguagePopup) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowLanguagePopup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLanguagePopup]);
  const navigate = useNavigate();

  const handleMusicClick = (e) => {
    e.preventDefault();
    navigate("/music");
  };
  const handleNowClick = (e) => {
    e.preventDefault();
    navigate("/now");
  };

  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">About</h1>
        <p className="page__lede">
          Computer Science + Cognitive Science at Brown University (’28). I
          build human-centric decision systems.
        </p>
        <div className="page__content">
          <div className="page__mediaRow page__mediaRow--about">
            <div>
              <p>
                I’m Jack de Haan — a builder with a research mindset. I'm
                passionate about everything in the intersection of{" "}
                <u>Cognitive Science</u> and <u>Computer Science</u>, and I
                spend a lot of time thinking about, writing about, and
                researching{" "}
                <u>how people interact with the systems in their lives</u> (from
                technology and language to AI and financial markets) and{" "}
                <u>
                  how this interaction influences both the users and the system
                  itself
                </u>
                .
              </p>
              <p>
                I care about shipping real tools, but I’m really obsessed with{" "}
                <u>the “why”</u>: incentives, interfaces, and the hidden
                decision systems that shape outcomes in the real world. Whether
                I'm working to improve a Brown's university-wide course
                registration platform or investigating how people are nudged by
                the technology all around them in their lives, I aim to bridge
                the gap between <u>technical complexity and human intuition</u>.
              </p>
            </div>

            <div className="page__mediaAside">
              <ImageCarousel
                className="carousel--portrait"
                ariaLabel="About photos"
                items={[
                  {
                    key: "about-1",
                    src: "/media/photos/green.JPG",
                    alt: "Enjoying Brown's greenhouse",
                    caption: "enjoying brown's greenhouse!",
                  },
                  {
                    key: "about-2",
                    src: "/media/photos/speech2.jpeg",
                    alt: "Giving the graduation address at Princeton in Beijing",
                    caption:
                      "giving the graduation address at Princeton in Beijing 2025",
                  },
                  {
                    key: "about-3",
                    src: "/media/photos/ski.jpeg",
                    alt: "jack with adorable little children in a ski gondola cabin!",
                    caption: "ski coaching the best kids this past winter!",
                  },
                ]}
              />
            </div>
          </div>

          <h2 className="page__sectionTitle">How I Operate</h2>
          <div className="page__textBlock">
            <p>
              I don't stay in one lane. Give me a project and I'll put my full
              effort and expend the{" "}
              <a onClick={() => setShowEnergyPopup(true)}>
                nigh-infinite energy I have
              </a>{" "}
              (actually. ask anyone who knows me!) to make it meticulously
              functional, but I actually work best when I'm working on many
              things at the same time. Working at a higher level like this isn't
              distracting--it actually keeps me more focused by seeing how
              everything fits together. I view products and organizations as
              decision systems that can be debugged and optimized.
            </p>
            <p>
              In whatever project I work on, my goal isn't just to add value,
              but it's also to synthesize ideas across the various disciplines I
              love I have—-HCI, systems thinking, behavioral economics, and so
              many more--to solve unstructured problems.
            </p>
          </div>

          {/* <h2 className="page__sectionTitle">Current Focus</h2>
          <ul className="page__list">
            <li>
              <u>Human-Centered Intelligent Systems:</u> Designing ethical
              choice architecture and digital nudges.
            </li>
            <li>
              <u>AI Safety & Governance:</u> Researching model robustness,
              interpretability, and alignment (Brown AI Safety Team).
            </li>
            <li>
              <u>High-Stakes Decision Systems:</u> Building tools for messy,
              real-world constraints (like C@Bnet).
            </li> */}
          {/* </ul> */}

          <h2 className="page__sectionTitle">beyond the work</h2>
          <div className="page__textBlock">
            <p>
              When I'm not building something, I'm usually trying to deconstruct
              a different kind of system. I am a competitive{" "}
              <u>puzzle hunter</u> (puzzle page coming soon), a{" "}
              <u>classical musician</u> (read about the{" "}
              <a href="/music" onClick={handleMusicClick}>
                music
              </a>{" "}
              I love), and an avid <u>language learner</u> (always{" "}
              <a onClick={() => setShowLanguagePopup(true)}>
                working on a new language
              </a>
              !). I believe that learning to think in different languages—even
              programming languages or maths/music—is the best way to keep the
              mind flexible and on its toes.
            </p>
          </div>

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
              <div className="page__metaValue">
                Git, AWS, Firebase, Vercel, Cloudflare, Tableau{" "}
              </div>
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
            <li>
              1st place (out of 5,000+ puzzlehunters) — MIT Mystery Hunt 2026
            </li>
            <li>2nd place — Tsinghua Inter-University Speech Contest</li>
            <li>Head of School Award, Rye Country Day School (Rye, NY)</li>
            <li>Selected class speaker — Princeton in Beijing</li>
          </ul>
        </div>
      </section>

      {showEnergyPopup && (
        <div
          className="projects__popupBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-energy-popup-title"
        >
          <div className="projects__popup">
            <h2 id="about-energy-popup-title" className="projects__popupTitle">
              re: energy
            </h2>
            <p className="projects__popupBody">
              I pour a lot of energy into the things I work on — sometimes to an
              arguably unreasonable degree.
            </p>
            <button
              type="button"
              className="projects__popupClose"
              onClick={() => setShowEnergyPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showLanguagePopup && (
        <div
          className="projects__popupBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="about-language-popup-title"
        >
          <div className="projects__popup">
            <h2
              id="about-language-popup-title"
              className="projects__popupTitle"
            >
              re: current language
            </h2>
            <p className="projects__popupBody">
              currently: korean, with another polyglot
            </p>
            <button
              type="button"
              className="projects__popupClose"
              onClick={() => setShowLanguagePopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
