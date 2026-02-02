import React from "react";
import CardSwap, { Card } from "../components/CardSwap";
import "./Page.css";
import "./Music.css";

export default function Music() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Music</h1>
        <p className="page__lede">
          what i'm currently listening to & what i always listen to
        </p>
        <div className="page__content music__content">
          <div className="music__copy">
            <h2 className="page__sectionTitle music__sectionTitle">
              What I'm listening to
            </h2>
            <p>
              I would say upwards of 99% of the music I listen to is classical.
              I do appreciate (and quite enjoy) many other artists, like Billie
              Eilish, Coldplay, Bad Bunny, Radiohead, but classical music
              unlocks something else in me.
            </p>
            <p>
              I listen to new pieces in chunks, where I'd listen to the same set
              of pieces, nonstop, for a few weeks at a time (eras), and then
              I'll switch it up with others, mostly recommendations from other
              friends. It not only helps me get very familiar with the pieces,
              but it also helps me link particular pieces to particular periods
              of time in my life.
            </p>
            <div className="page__callout music__listCard">
              <p>
                <b>From January 20th</b>. Credits to Leo and Daniel for the
                recs!
              </p>
              <ul className="music__list">
                <li>Poulenc Piano Concerto in C-Sharp Minor</li>
                <li>Poulenc Piano Concerto for 2 Pianos and Orchestra</li>
                <li>Prokofiev Piano Sonata No. 1</li>
                <li>Dvořák Symphony No. 6</li>
                <li>Dvořák Symphony No. 7</li>
              </ul>
            </div>

            <p className="music__hint">
              have suggestions for the next era? send me a{" "}
              <a href="mailto:music_recs@jackdehaan.com?subject=music%20recommendations!&body=hey%20jack!%20i'm%20%3Cyour%20name%3E%2C%20i%20really%20think%20you%20should%20listen%20to%20%3Cpiece%2Fsong%3E!">
                message
              </a>
              !
            </p>
            <h2 className="page__sectionTitle music__sectionTitle">
              What I always listen to
            </h2>
            <p>
              However, there are some pieces that are my favourite. I know that
              they, for the most part, will stay consistent throughout my life.
              They're all tied to important events, emotions, and people in my
              life. You're welcome to explore some of them in the stack on the
              right.
            </p>
          </div>
          <div className="music__cards">
            <CardSwap
              width={340}
              height={300}
              cardDistance={18}
              verticalDistance={32}
              mode="stack"
            >
              <Card className="music__card">
                <h3 className="cardSwap__title">Mahler Symphony 6</h3>
                <p className="cardSwap__subtitle">
                  Hands down the best Mahler Symphony (i'm familiar with 1-8 and
                  yes this is better than even 2), one might say my favourite
                  symphony ever?? The story it tells is truly magnificent and
                  heartbreaking.
                </p>
                <div className="cardSwap__embed">
                  {/* Replace the src below with your own Apple Music embed URL.
                    From Apple Music, share a playlist/album and choose
                    "Copy Embed Code", then paste the src here. */}
                  <iframe
                    title="Mahler Symphony 6"
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                    frameBorder="0"
                    height="175"
                    style={{ width: "100%", borderRadius: 12 }}
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    src="https://embed.music.apple.com/us/album/mahler-symphony-no-6/1452503818"
                  />
                </div>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">
                  Rachmaninoff Piano Concerto No. 2
                </h3>
                <p className="cardSwap__subtitle">
                  This piece is a lot of peoples' favourites, and though it's so
                  often played, it's so incredibly emotional for me. I always
                  get goosebumps at the ending.
                </p>
                <div className="cardSwap__embed">
                  <iframe
                    title="Rach 2"
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                    frameBorder="0"
                    height="175"
                    style={{ width: "100%", borderRadius: 12 }}
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    src="https://www.youtube.com/embed/dvYYXHpEcGE?start=18"
                  />
                </div>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">Márquez: Danzón No. 2</h3>
                <p className="cardSwap__subtitle">
                  Such beautiful expression and storytelling. I never not want
                  to listen to this piece.
                </p>
                <div className="cardSwap__embed">
                  <iframe
                    title="Danzón No. 2"
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                    frameBorder="0"
                    height="175"
                    style={{ width: "100%", borderRadius: 12 }}
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    src="https://embed.music.apple.com/us/song/danz%C3%B3n-no-2-live/1725563571"
                  />
                </div>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">
                  Chopin Nocturnes, Op. 27 No. 2
                </h3>
                <p className="cardSwap__subtitle">I love the voices.</p>
                <div className="cardSwap__embed">
                  <iframe
                    title="Nocturne Op. 27 No. 2"
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                    frameBorder="0"
                    height="175"
                    style={{ width: "100%", borderRadius: 12 }}
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    src="https://embed.music.apple.com/us/song/nocturnes-op-27-no-2-in-d-flat-major/594180668"
                  />
                </div>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">Liszt: Liebestraume No. 3</h3>
                <p className="cardSwap__subtitle">
                  Dreams of love. What more can you dream for?
                </p>
                <div className="cardSwap__embed">
                  <iframe
                    title="Liszt: Liebestraume No. 3"
                    allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
                    frameBorder="0"
                    height="175"
                    style={{ width: "100%", borderRadius: 12 }}
                    sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
                    src="https://embed.music.apple.com/us/song/liebestraum-no-3-in-a-flat-major-s-541-no-3/1452501018"
                  />
                </div>
              </Card>
            </CardSwap>

            <CardSwap
              width={340}
              height={300}
              cardDistance={0}
              verticalDistance={0}
              mode="list"
            >
              <Card className="music__card">
                <h3 className="cardSwap__title">Mahler Symphony 6</h3>
                <p className="cardSwap__subtitle">
                  Hands down the best Mahler Symphony (i'm familiar with 1-8 and
                  yes this is better than even 2), one might say my favourite
                  symphony ever?? The story it tells is truly magnificent and
                  heartbreaking.
                </p>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">
                  Rachmaninoff Piano Concerto No. 2
                </h3>
                <p className="cardSwap__subtitle">
                  This piece is a lot of peoples' favourites, and though it's so
                  often played, it's so incredibly emotional for me. I always
                  get goosebumps at the ending.
                </p>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">Márquez: Danzón No. 2</h3>
                <p className="cardSwap__subtitle">
                  Such beautiful expression and storytelling. I never not want
                  to listen to this piece.
                </p>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">
                  Chopin Nocturnes, Op. 27 No. 2
                </h3>
                <p className="cardSwap__subtitle">I love the voices.</p>
              </Card>

              <Card className="music__card">
                <h3 className="cardSwap__title">Liszt: Liebestraume No. 3</h3>
                <p className="cardSwap__subtitle">
                  Dreams of love. What more can you dream for?
                </p>
              </Card>
            </CardSwap>
          </div>
        </div>
      </section>
    </div>
  );
}
