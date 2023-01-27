module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f5fa',
          100: '#f2eaf5',
          200: '#e4d5ec',
          300: '#d2b9df',
          400: '#bc96cf',
          500: '#a370bd',
          600: '#874ca4',
          650: '#7d4698',
          700: '#6a3b81',
          800: '#5c3370',
          900: '#4a2a5b',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
