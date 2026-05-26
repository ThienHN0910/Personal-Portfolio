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
          bg: '#020617',
          cyan: '#00F2FF',
          purple: '#7000FF',
          glass: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(0, 242, 255, 0.2)'
        },
      },
      fontFamily: {
        os: ['Orbitron', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 8px 32px rgba(0,242,255,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
      },
    },
  },
  plugins: [],
}
