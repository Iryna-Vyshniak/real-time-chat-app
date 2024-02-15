/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ea580c',
        primary: '#D4EC8C',
        secondary: '#FFD998',
        green: '#B6D285',
        beige: '#fee0ab',
      },
    },
  },

  backgroundImage: {},
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
};
