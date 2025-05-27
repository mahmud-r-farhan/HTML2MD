/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gray: { // Custom dark theme palette
          900: '#121212', 
          800: '#1E1E1E', 
          700: '#2A2A2A', 
          600: '#3D3D3D',
          500: '#555555',
          400: '#7A7A7A', 
          300: '#A0A0A0',
          200: '#CFCFCF',
          100: '#EFEFEF', 
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}