import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import starPng from "./assets/star.png";

if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host === "jacksharks05.github.io") {
    const target = `https://jackdehaan.com${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(target);
  }
}

const setFavicon = (href) => {
  if (typeof document === "undefined") return;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
};

setFavicon(starPng);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
