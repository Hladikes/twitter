/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#949dff',
        'primary': '#28292e',
        'secondary': '#121317',
        'primary-text': '#FFFFFF',
      }
    },
  },
  plugins: [],
}