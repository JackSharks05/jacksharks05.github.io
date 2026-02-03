import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import "./App.css";

const Loading = () => <div className="page">Loading…</div>;

function App() {
  const isProd = import.meta.env.PROD;

  if (isProd) {
    return (
      <Routes>
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    );
  }

  const SiteLayout = React.lazy(() => import("./components/SiteLayout"));
  const Home = React.lazy(() => import("./pages/Home"));
  const About = React.lazy(() => import("./pages/About"));
  const Now = React.lazy(() => import("./pages/Now"));
  const ThisSite = React.lazy(() => import("./pages/ThisSite"));
  const Projects = React.lazy(() => import("./pages/Projects"));
  const Research = React.lazy(() => import("./pages/Research"));
  const Music = React.lazy(() => import("./pages/Music"));
  const Thoughts = React.lazy(() => import("./pages/Thoughts"));
  const Contact = React.lazy(() => import("./pages/Contact"));
  const PhotographyVideography = React.lazy(
    () => import("./pages/PhotographyVideography"),
  );
  const Resume = React.lazy(() => import("./pages/Resume"));
  const NotFound = React.lazy(() => import("./pages/NotFound"));

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="now" element={<Now />} />
          <Route path="this-site" element={<ThisSite />} />
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
          <Route
            path="experience"
            element={<Navigate to="/resume" replace />}
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
