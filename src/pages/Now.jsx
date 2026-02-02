import React from "react";
import LightPillar from "../components/LightPillar";
import "./Page.css";
import "./Now.css";

export default function Now() {
  return (
    <div className="page">
      <section className="page__card now">
        <div className="now__bg" aria-hidden="true">
          <LightPillar
            bottomColor="#621F6D"
            topColor="#FE0000"
            intensity={0.95}
            rotationSpeed={0.35}
            glowAmount={0.006}
            noiseIntensity={0.45}
            pillarWidth={3.2}
            pillarHeight={0.45}
            pillarRotation={18}
            quality="medium"
          />
          <div className="now__veil" />
        </div>

        <div className="now__content">
          <h1 className="page__title">Now</h1>
          <p className="page__lede">what's happening in my life currenly!</p>
          <div className="page__content">
            <p>I am currently:</p>
            <ul className="page__list">
              <li>in my fourth semester at Brown! </li>{" "}
              {/*Taking:</li>
              {/* <ul className="page__list">
                <li>Distributed Systems</li>
                <li>Computational Linguistics</li>
                <li>Logic in Language and Thought</li>
                <li>Bilingualism</li>
                <li>History of Chatbots (Independent Study)</li>
              </ul> */}
              <li>helping to write MIT mystery hunt 2027!</li>
              <li>self-studying learning korean with another polyglot</li>
              <li>applying for summer internships :(</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
