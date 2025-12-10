/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        advent: {
          red: '#DC2626',
          green: '#16A34A',
          gold: '#F59E0B',
          snow: '#F8FAFC'
        }
      },
      fontFamily: {
        'christmas': ['"Comic Sans MS"', 'cursive', 'sans-serif']
      }
    },
  },
  plugins: [],
}

