import React, { useRef, useEffect } from "react";
import Globe from "react-globe.gl";

const EarthGlobe = ({
  latitude,
  longitude,
  width = 200,
  height = 200,
  transitionMs = 1000,
  onLocationClick,
}) => {
  const globeEl = useRef();

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.0;

      // Set initial view to location
      globeEl.current.pointOfView(
        { lat: latitude, lng: longitude, altitude: 2.5 },
        transitionMs,
      );
    }
  }, [latitude, longitude, transitionMs]);

  const handleGlobeClick = (coords) => {
    if (coords && onLocationClick) {
      onLocationClick(coords.lat, coords.lng);
    }
  };

  return (
    <Globe
      ref={globeEl}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      showAtmosphere={true}
      atmosphereColor="lightskyblue"
      atmosphereAltitude={0.15}
      onGlobeClick={handleGlobeClick}
      pointsData={[{ lat: latitude, lng: longitude }]}
      pointAltitude={0.01}
      pointColor={() => "#ff3333"}
      pointRadius={0.5}
      pointsMerge={true}
    />
  );
};

export default EarthGlobe;
