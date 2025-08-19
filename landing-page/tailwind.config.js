/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brainsait: {
          primary: '#7c3aed',    // violet-600
          secondary: '#a855f7',  // purple-500
          accent: '#c084fc',     // purple-400
          dark: '#1e1b4b',       // indigo-900
          darker: '#0f0f23',     // custom dark
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Monaco', 'monospace'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%': { 'box-shadow': '0 0 20px rgba(124, 58, 237, 0.3)' },
          '100%': { 'box-shadow': '0 0 40px rgba(124, 58, 237, 0.6)' },
        }
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at 25% 25%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 75% 75%, #a855f7 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}