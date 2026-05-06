/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gapcode: '#0070f3',
        easy: '#00b894',
        medium: '#f39c12',
        hard: '#e74c3c',
      },
    },
  },
  plugins: [],
}
