/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: '#8a5cff',
        brand2: '#00e08f',
      },
    },
  },
  plugins: [],
}


