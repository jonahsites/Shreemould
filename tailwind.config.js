/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0A0A0B',
        'luxury-grey': '#2A2A2C',
        'accent': '#C5A47E',
      }
    },
  },
  plugins: [],
}
