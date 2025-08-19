import React from 'react';
import { motion } from 'framer-motion';

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Primary animated gradient mesh */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle at 10% 10%, #000000 0%, transparent 50%),
            radial-gradient(circle at 90% 10%, #7c3aed 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, #1e1b4b 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, #0f0f23 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%',
          mixBlendMode: 'multiply'
        }}
        animate={{
          backgroundPosition: [
            '10% 10%, 90% 10%, 50% 50%, 10% 90%, 90% 90%, 70% 30%',
            '15% 15%, 85% 15%, 45% 55%, 15% 85%, 85% 85%, 75% 25%',
            '10% 10%, 90% 10%, 50% 50%, 10% 90%, 90% 90%, 70% 30%'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Wireframe overlay with differential speed */}
      <motion.div 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, #7c3aed 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, #c084fc 0%, transparent 40%),
            radial-gradient(circle at 20% 80%, #000000 0%, transparent 40%),
            radial-gradient(circle at 50% 10%, rgba(255,255,255,0.2) 0%, transparent 40%),
            radial-gradient(circle at 50% 90%, #8b5cf6 0%, transparent 40%)
          `,
          backgroundSize: '60% 60%, 60% 60%, 60% 60%, 60% 60%, 60% 60%, 60% 60%',
          mixBlendMode: 'overlay'
        }}
        animate={{
          backgroundPosition: [
            '20% 20%, 80% 20%, 80% 80%, 20% 80%, 50% 10%, 50% 90%',
            '25% 25%, 75% 25%, 75% 75%, 25% 75%, 45% 15%, 55% 85%',
            '20% 20%, 80% 20%, 80% 80%, 20% 80%, 50% 10%, 50% 90%'
          ]
        }}
        transition={{
          duration: 30, // Slower differential speed
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated geometric overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full opacity-20"
        style={{
          background: `
            linear-gradient(45deg, transparent 40%, rgba(124, 58, 237, 0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(168, 85, 247, 0.1) 50%, transparent 60%)
          `,
          backgroundSize: '200px 200px, 150px 150px'
        }}
        animate={{
          backgroundPosition: [
            '0% 0%, 0% 0%',
            '100% 100%, -100% 100%',
            '0% 0%, 0% 0%'
          ]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

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

      {/* Floating orbs */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              ['rgba(124, 58, 237, 0.3)', 'rgba(168, 85, 247, 0.3)', 'rgba(192, 132, 252, 0.3)'][i % 3]
            } 0%, transparent 70%)`,
            filter: 'blur(20px)',
            left: `${20 + (i * 15)}%`,
            top: `${10 + (i * 12)}%`
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 15 + (i * 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

export default MeshBackground;