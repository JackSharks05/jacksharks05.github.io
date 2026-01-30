import React from "react";
import "./Page.css";

export default function Music() {
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Music</h1>
        <p className="page__lede">
          Tracks, performances, playlists, and works-in-progress.
        </p>
        <div className="page__content">
          <p>Embed Spotify/SoundCloud/Bandcamp, or link to releases.</p>
        </div>
      </section>
    </div>
  );
}
