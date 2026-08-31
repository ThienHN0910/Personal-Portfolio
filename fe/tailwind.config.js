/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        bone: 'var(--bone)',
        surface: 'var(--surface)',
        ink: {
          DEFAULT: 'var(--ink)',
          secondary: 'var(--ink-secondary)',
          tertiary: 'var(--ink-tertiary)',
        },
        stroke: {
          DEFAULT: 'var(--stroke)',
          soft: 'var(--stroke-soft)',
        },
        // Spot pastels mapped dynamically to theme variables
        pastel: {
          red: 'var(--pastel-red)',
          'red-text': 'var(--pastel-red-text)',
          blue: 'var(--pastel-blue)',
          'blue-text': 'var(--pastel-blue-text)',
          green: 'var(--pastel-green)',
          'green-text': 'var(--pastel-green-text)',
          amber: 'var(--pastel-amber)',
          'amber-text': 'var(--pastel-amber-text)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'SF Pro Display', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Instrument Serif', 'Georgia', 'serif'],
        mono: ['DM Mono', 'SF Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'ambient': '0 4px 30px 0 rgba(0,0,0,0.5)',
        'ambient-hover': '0 8px 40px 0 rgba(0,0,0,0.7)',
        'card': '0 4px 20px 0 rgba(0,0,0,0.4)',
        'card-hover': '0 8px 32px 0 rgba(0,0,0,0.6)',
        'bezel-inner': 'inset 0 1px 1px rgba(255,255,255,0.08)',
        'bezel-outer': '0 0 0 1px rgba(255,255,255,0.06)',
        'island': '0 12px 36px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        'island-hover': '0 20px 48px 0 rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.14)',
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


