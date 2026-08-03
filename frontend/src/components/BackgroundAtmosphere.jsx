import React, { useEffect, useRef } from 'react';
import './BackgroundAtmosphere.css';

export default function BackgroundAtmosphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;

      document.body.style.setProperty('--mouse-x', `${xPercent}%`);
      document.body.style.setProperty('--mouse-y', `${yPercent}%`);
      document.body.style.setProperty('--mouse-px-x', `${clientX}px`);
      document.body.style.setProperty('--mouse-px-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="global-depth-engine" ref={containerRef}>
      {/* LAYER 1: Background Atmosphere (Dark Luxury Gradient & Volumetric Light) */}
      <div className="layer-1-bg-atmosphere">
        <div className="volumetric-spotlight"></div>
        <div className="saffron-ambient-radial"></div>
      </div>

      {/* LAYER 2: Ambient Motion (Breathing Haze & Floating Spice Particles) */}
      <div className="layer-2-ambient-motion">
        <div className="breathing-haze-orb orb-alpha"></div>
        <div className="breathing-haze-orb orb-beta"></div>
        <div className="breathing-haze-orb orb-gamma"></div>

        {/* Floating Spice Dust Particles */}
        <div className="spice-particles-container">
          <span className="spice-particle p1">✨</span>
          <span className="spice-particle p2">🌶️</span>
          <span className="spice-particle p3">🌟</span>
          <span className="spice-particle p4">🌿</span>
          <span className="spice-particle p5">✨</span>
          <span className="spice-particle p6">🍂</span>
          <span className="spice-particle p7">💫</span>
          <span className="spice-particle p8">✨</span>
          <span className="spice-particle p9">🌶️</span>
          <span className="spice-particle p10">🌟</span>
        </div>
      </div>
    </div>
  );
}
