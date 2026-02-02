import React from "react";
import ImageCarousel from "../components/ImageCarousel";
import "./Page.css";

export default function Contact() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Contact</h1>
        <p className="page__lede">Get into contact!</p>
        <div className="page__content">
          <div className="page__mediaRow">
            <div>
              <p>
                If you're hiring, want to collaborate, or just chat–please feel
                free to reach out! I love meeting new people and would love to
                hear what stories you have to share.
              </p>
              <p>
                Contact me at{" "}
                <a href="mailto:contact@jackdehaan.com">
                  contact@jackdehaan.com
                </a>{" "}
                or connect with me on{" "}
                <a href="https://linkedin.com/jackdehaan">LinkedIn</a>!
              </p>
            </div>

            <div className="page__mediaAside">
              <ImageCarousel
                className="carousel--portrait"
                ariaLabel="Contact photos"
                items={[
                  {
                    key: "contact-1",
                    src: "/media/photos/shadow.jpeg",
                    alt: "jack in the shadows with the providence skyline faintly in the background",
                    caption: "i promise i'm not scary! :D",
                  },
                  {
                    key: "contact-2",
                    src: "/media/photos/speech1.png",
                    alt: "jack in front of a crowd at a chinese speech contest",
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
