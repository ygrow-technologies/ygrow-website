/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        navy: '#0c0c0c',
        steel: '#666666',
        sky: '#e7e7e4',
        ice: '#f0f0ed',
        fog: '#f5f5f2',
        slate: {
          50: '#f7f7f5',
          100: '#eeeeeb',
          200: '#deded9',
          300: '#c6c6c0',
          400: '#999993',
          500: '#6f6f6a',
          600: '#52524e',
          700: '#3b3b38',
          800: '#242422',
          900: '#171716',
          950: '#0b0b0b',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(0, 0, 0, 0.065)',
        card: '0 10px 30px rgba(0, 0, 0, 0.045)',
        glow: '0 20px 55px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
}
