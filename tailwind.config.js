/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9C36BE',   // Cor personalizada
        secundary: '#0a0a0a'  // Cor personalizada
      },
    },
    fontFamily: {
      'sans': ['Montserrat', 'sans-serif'],
      'arcade': ['Arcade Ya', 'sans-serif'],
    },
  },
  plugins: [],
}
