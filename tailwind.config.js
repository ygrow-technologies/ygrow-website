/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0a1433',
          coral: '#ff4f52',
          teal: '#12c8bf',
          blue: '#2f6df3',
        },
        ink: '#0a1433',
        navy: '#07102a',
        steel: '#67728a',
        sky: '#12c8bf',
        ice: '#e8f2ff',
        fog: '#f5f7fc',
        slate: {
          50: '#f5f7fc',
          100: '#e9edf6',
          200: '#d7deeb',
          300: '#bcc6d8',
          400: '#8793aa',
          500: '#667188',
          600: '#4e596f',
          700: '#354158',
          800: '#202c46',
          900: '#121d39',
          950: '#07102a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 70px rgba(10, 20, 51, 0.09)',
        card: '0 10px 30px rgba(10, 20, 51, 0.07)',
        glow: '0 20px 55px rgba(3, 9, 30, 0.28)',
      },
    },
  },
  plugins: [],
}
