/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1C355C',
        'custom-green': '#92aa34',
        'hover-gray': '#E8E8E8',
      },
    },
  },
  plugins: [],
}

