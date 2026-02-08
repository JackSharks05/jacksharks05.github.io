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
                free to reach out! I <strong>love</strong> meeting new people
                and would love to hear what stories you can share!
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
                    src: "/star.png",
                    alt: 'jack\'s "logo"',
                    caption:
                      'a photoshopped recoloring of the star arcanum from "the dragon prince" i made a long time ago, now used as my profile picture!',
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
