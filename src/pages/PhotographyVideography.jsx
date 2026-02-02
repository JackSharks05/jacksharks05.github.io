import React, { useEffect, useState } from "react";
import Masonry from "../components/Masonry";
import "./Page.css";
import "./PhotographyVideography.css";

export default function PhotographyVideography() {
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);
  return (
    <div className="page">
      <section className="page__card">
        <h1 className="page__title">Photography &amp; Videography</h1>
        <p className="page__lede">
          A few stills from places that stuck with me.
        </p>
        <div className="page__content photography__content">
          <Masonry
            items={[
              {
                id: "speech1",
                img: "/media/photos/speech1.png",
                url: "/media/photos/speech1.png",
                height: 520,
                label: "Speech, summer 2019",
                description:
                  "Talking about design and learning in a small auditorium.",
              },
              {
                id: "speech2",
                img: "/media/photos/speech2.jpeg",
                url: "/media/photos/speech2.jpeg",
                height: 520,
                label: "Speech, winter 2019",
                description: "A different stage; same nerves.",
              },
              {
                id: "leaf",
                img: "/media/photos/leaf.JPG",
                url: "/media/photos/leaf.JPG",
                height: 640,
                label: "Leaf in shadow",
                description: "Afternoon light catching a single leaf.",
              },
              {
                id: "tree",
                img: "/media/photos/tree.jpeg",
                url: "/media/photos/tree.jpeg",
                height: 680,
                label: "Tree at dusk",
                description: "Long exposure in a very quiet park.",
              },
              {
                id: "hanging",
                img: "/media/photos/hanging.jpeg",
                url: "/media/photos/hanging.jpeg",
                height: 720,
                label: "Hanging lights",
                description: "Warm lights over a winter street.",
              },
              {
                id: "franconia",
                img: "/media/photos/franconia.JPG",
                url: "/media/photos/franconia.JPG",
                height: 720,
                label: "Franconia",
                description: "A hazy hike near Franconia Notch.",
              },
              {
                id: "green",
                img: "/media/photos/green.JPG",
                url: "/media/photos/green.JPG",
                height: 640,
                label: "Green field",
                description: "Soaked grass after a sudden storm.",
              },
              {
                id: "shadow",
                img: "/media/photos/shadow.jpeg",
                url: "/media/photos/shadow.jpeg",
                height: 640,
                label: "Shadow",
                description: "Finding shapes in late afternoon light.",
              },
              {
                id: "shanghai",
                img: "/media/photos/shanghai.jpeg",
                url: "/media/photos/shanghai.jpeg",
                height: 720,
                label: "Shanghai",
                description: "Neon and rain downtown.",
              },
              {
                id: "ski",
                img: "/media/photos/ski.jpeg",
                url: "/media/photos/ski.jpeg",
                height: 680,
                label: "Ski lift",
                description: "Blue hour on the way up the mountain.",
              },
              {
                id: "guards1",
                img: "/media/photos/guards1.jpg",
                url: "/media/photos/guards1.jpg",
                height: 640,
                label: "Guards",
                description: "Changing of the guard, handheld at a distance.",
              },
              {
                id: "yiheyuan",
                img: "/media/photos/yiheyuan.jpeg",
                url: "/media/photos/yiheyuan.jpeg",
                height: 720,
                label: "Yiheyuan",
                description: "Muted colors at the Summer Palace.",
              },
            ]}
            animateFrom="bottom"
            blurToFocus
            colorShiftOnHover
            onItemClick={setSelected}
          />
          {selected && (
            <div
              className="photography__overlay"
              onClick={() => setSelected(null)}
            >
              <aside
                className="photography__overlayCard"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="photography__overlayImageWrap">
                  <img
                    src={selected.img}
                    alt={selected.label || "Selected photograph"}
                    className="photography__overlayImage"
                  />
                </div>
                {selected.label && (
                  <h2 className="photography__overlayTitle">
                    {selected.label}
                  </h2>
                )}
                {selected.description && (
                  <p className="photography__overlayText">
                    {selected.description}
                  </p>
                )}
                <p className="photography__overlayClose">
                  Tap anywhere outside to close.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
