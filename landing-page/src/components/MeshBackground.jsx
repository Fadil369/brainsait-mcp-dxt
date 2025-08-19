import React from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

const MeshBackground = () => {
  // Primary gradient configuration
  const primaryConfig = {
    animate: true,
    speed: 0.3,
    colors: [
      '#000000', // Black base
      '#7c3aed', // Violet primary
      '#a855f7', // Purple secondary
      '#ffffff', // Selective white
      '#1e1b4b', // Dark indigo
      '#0f0f23'  // Darker custom
    ],
    colorAnchors: [
      { x: 0.1, y: 0.1 },  // Top-left black
      { x: 0.9, y: 0.1 },  // Top-right violet
      { x: 0.5, y: 0.5 },  // Center purple
      { x: 0.1, y: 0.9 },  // Bottom-left white accent
      { x: 0.9, y: 0.9 },  // Bottom-right dark
      { x: 0.7, y: 0.3 }   // Off-center darker
    ],
    blendMode: 'multiply',
    opacity: 1
  };

  // Wireframe overlay configuration
  const wireframeConfig = {
    animate: true,
    speed: 0.2, // Slower differential
    colors: [
      '#7c3aed', // Violet wireframe
      '#a855f7', // Purple wireframe
      '#c084fc', // Lighter purple
      '#000000', // Black intersections
      '#ffffff', // White highlights
      '#8b5cf6'  // Mid-tone purple
    ],
    colorAnchors: [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.2 },
      { x: 0.8, y: 0.8 },
      { x: 0.2, y: 0.8 },
      { x: 0.5, y: 0.1 },
      { x: 0.5, y: 0.9 }
    ],
    blendMode: 'overlay',
    opacity: 0.6, // 60% opacity for depth
    wireframe: true
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Primary mesh gradient */}
      <div className="absolute inset-0 w-full h-full">
        <MeshGradient
          {...primaryConfig}
          className="w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
      
      {/* Wireframe overlay with differential speed */}
      <div className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }}>
        <MeshGradient
          {...wireframeConfig}
          className="w-full h-full"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            mixBlendMode: 'overlay'
          }}
        />
      </div>

      {/* Additional depth layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 pointer-events-none" />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px'
        }}
      />
    </div>
  );
};

export default MeshBackground;