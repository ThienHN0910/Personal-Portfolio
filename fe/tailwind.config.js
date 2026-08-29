/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FBFBFA',
        bone: '#F7F6F3',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#111111',
          secondary: '#787774',
          tertiary: '#AEACAB',
        },
        stroke: {
          DEFAULT: '#EAEAEA',
          soft: 'rgba(0,0,0,0.06)',
        },
        // Muted pastel accents — scarce, semantic only
        pastel: {
          red: '#FDEBEC',
          'red-text': '#9F2F2D',
          blue: '#E1F3FE',
          'blue-text': '#1F6C9F',
          green: '#EDF3EC',
          'green-text': '#346538',
          amber: '#FBF3DB',
          'amber-text': '#956400',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'SF Pro Display', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['DM Mono', 'SF Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Ultra-diffuse, near-invisible shadows as per skill protocol (<0.05 opacity)
        'ambient': '0 2px 16px 0 rgba(0,0,0,0.04)',
        'ambient-hover': '0 4px 24px 0 rgba(0,0,0,0.07)',
        'card': '0 1px 4px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 2px 8px 0 rgba(0,0,0,0.05)',
        // Double-bezel inner highlight
        'bezel-inner': 'inset 0 1px 1px rgba(255,255,255,0.8)',
        'bezel-outer': '0 0 0 1px rgba(0,0,0,0.05)',
        // Floating island nav
        'island': '0 4px 24px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'island-hover': '0 8px 32px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-up': 'fadeUp 600ms cubic-bezier(0.16,1,0.3,1) both',
        'drift': 'drift 28s ease-in-out infinite alternate',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          from: { transform: 'translate(0,0) scale(1)' },
          to: { transform: 'translate(60px,40px) scale(1.08)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.32,0.72,0,1)',
        'out-expo': 'cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [],
}


