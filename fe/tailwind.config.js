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
          card: '#0A0F1D',
          elevated: '#0E1526',
          cyan: '#00E5FF',
          'cyan-muted': 'rgba(0, 229, 255, 0.12)',
          indigo: '#6366f1',
          purple: '#8b5cf6',
          violet: '#a78bfa',
          emerald: '#10b981',
          amber: '#f59e0b',
          glass: 'rgba(10, 15, 29, 0.75)',
          border: 'rgba(0, 229, 255, 0.16)',
          'border-muted': 'rgba(255, 255, 255, 0.07)',
          'border-hover': 'rgba(0, 229, 255, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 8px 32px -4px rgba(0, 229, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'cyan-glow-hover': '0 12px 40px -4px rgba(0, 229, 255, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'glass-card': '0 12px 36px -8px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glass-card-hover': '0 16px 44px -8px rgba(0, 0, 0, 0.8), 0 0 24px -2px rgba(0, 229, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float-slow': 'floatSlow 6s infinite ease-in-out',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.02)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

