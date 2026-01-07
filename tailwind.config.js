/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0f0518',        // Deep Space Purple
          panel: '#1a1025',     // Lighter panel
          pink: '#ff00ff',      // Neon Pink
          cyan: '#00f3ff',      // Neon Cyan
          amber: '#ffaa00',     // Neon Amber
          grid: '#2a1a3a'       // Grid lines
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'], // Retro terminal feel
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ff00ff, 0 0 20px #ff00ff',
        'neon-cyan': '0 0 10px #00f3ff, 0 0 20px #00f3ff',
        'neon-amber': '0 0 10px #ffaa00, 0 0 20px #ffaa00',
        'glow-inset': 'inset 0 0 15px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
