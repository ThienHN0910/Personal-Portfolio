/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',
          card: '#0B0F19',
          cyan: '#00F2FF',
          indigo: '#6366f1',
          purple: '#7000FF',
          violet: '#8b5cf6',
          emerald: '#10b981',
          amber: '#f59e0b',
          glass: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(0, 242, 255, 0.18)',
          'border-muted': 'rgba(255, 255, 255, 0.08)'
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        os: ['Orbitron', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 8px 32px rgba(0, 242, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'violet-glow': '0 8px 32px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-card': '0 10px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float-slow': 'floatSlow 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}

