/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#FBF5D5',
          200: '#F6EBAB',
          300: '#F2E282',
          400: '#EDD858',
          500: '#E9CE2E',
          600: '#D4AF37', // Classic metallic gold
          700: '#AA8C2C',
          800: '#806921',
          900: '#554616',
        },
        dark: {
          100: '#2C3E50',
          200: '#202D3A',
          300: '#17202A',
          400: '#0F172A', // Slate 900-ish
          500: '#0A0E17', // Very dark blue/black
          600: '#080B12',
          700: '#05070C',
          800: '#030406',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
