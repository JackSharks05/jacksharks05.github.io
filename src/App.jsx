import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Research from "./pages/Research";
import Music from "./pages/Music";
import Thoughts from "./pages/Thoughts";
import Contact from "./pages/Contact";
import PhotographyVideography from "./pages/PhotographyVideography";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="projects" element={<Projects />} />
        <Route path="research" element={<Research />} />
        <Route path="music" element={<Music />} />
        <Route path="thoughts" element={<Thoughts />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="photography-videography"
          element={<PhotographyVideography />}
        />
        <Route
          path="photography-and-videography"
          element={<Navigate to="/photography-videography" replace />}
        />
        <Route
          path="photography"
          element={<Navigate to="/photography-videography" replace />}
        />
        <Route path="resume" element={<Resume />} />

        {/* Backwards-compat / constellation section mapping */}
        <Route path="experience" element={<Navigate to="/resume" replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
