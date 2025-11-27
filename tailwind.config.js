/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // class-based dark mode - html element'inde 'dark' class'ı olmalı
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

