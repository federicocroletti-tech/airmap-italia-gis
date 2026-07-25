/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aptos', 'Segoe UI', 'sans-serif'],
        display: ['Bahnschrift', 'Aptos', 'sans-serif'],
      },
      colors: {
        airmap: {
          ink: '#122033',
          muted: '#5d6d7f',
          surface: '#f5f8fb',
          line: '#d8e2eb',
          primary: '#176b87',
          accent: '#1b998b',
          warning: '#f5b841',
          danger: '#dc3a3a',
          critical: '#7b3f98',
        },
      },
      boxShadow: {
        panel: '0 18px 50px rgba(18, 32, 51, 0.14)',
      },
    },
  },
  plugins: [],
};
