/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': '1024px',
        'lg-home': '1100px'
      },
    },
  },
  plugins: [],
}