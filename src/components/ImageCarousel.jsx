import React, { useMemo, useState } from "react";
import "./ImageCarousel.css";

export default function ImageCarousel({
  items = [],
  className = "",
  ariaLabel = "Image carousel",
}) {
  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const slides = safeItems.length
    ? safeItems
    : [
        {
          key: "placeholder-1",
          alt: "",
          caption: "Drop images here later",
        },
        {
          key: "placeholder-2",
          alt: "",
          caption: "Projects • Research • Travel",
        },
        {
          key: "placeholder-3",
          alt: "",
          caption: "Anything you want to highlight",
        },
      ];

  const [index, setIndex] = useState(0);

  const clampIndex = (n) => {
    if (slides.length <= 0) return 0;
    const m = n % slides.length;
    return m < 0 ? m + slides.length : m;
  };

  const go = (n) => setIndex(clampIndex(n));

  return (
    <section className={`carousel ${className}`.trim()} aria-label={ariaLabel}>
      <div className="carousel__viewport">
        {slides.map((it, i) => {
          const isActive = i === index;
          const hasSrc = Boolean(it.src);

          return (
            <div
              key={it.key || it.src || it.caption || i}
              className={
                isActive ? "carousel__slide is-active" : "carousel__slide"
              }
              aria-hidden={!isActive}
            >
              {hasSrc ? (
                <img
                  className="carousel__img"
                  src={it.src}
                  alt={it.alt || ""}
                  loading="lazy"
                />
              ) : (
                <div
                  className="carousel__placeholder"
                  role="img"
                  aria-label="Placeholder image"
                >
                  <div className="carousel__placeholderText">Image</div>
                </div>
              )}

              {it.caption ? (
                <div className="carousel__caption">{it.caption}</div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__btn"
          onClick={() => go(index - 1)}
          aria-label="Previous"
        >
          Prev
        </button>
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                i === index ? "carousel__dot is-active" : "carousel__dot"
              }
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="carousel__btn"
          onClick={() => go(index + 1)}
          aria-label="Next"
        >
          Next
        </button>
      </div>
    </section>
  );
}
