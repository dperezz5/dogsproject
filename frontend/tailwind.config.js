/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dogswipe: {
          yellow: '#fad089',
          orange: '#ff9c5b',
          coral: '#f5634a',
          red: '#ed303c',
          teal: '#3b8183',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 