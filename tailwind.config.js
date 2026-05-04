/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2F3E2F',
          dark: '#1E2A1E',
          light: '#3D503D',
        },
        cream: {
          DEFAULT: '#EAE5C9',
          dark: '#D4CFA8',
          light: '#F5F2E0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
