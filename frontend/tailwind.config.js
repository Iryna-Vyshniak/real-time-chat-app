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
      dropShadow: {
        '1xl-white': '0 1px 1px rgba(250, 250, 250, 1)',
        '1xl-black': '0 1px 0.5px rgba(0, 0, 0, 1)',
        '2xl-black': '0 0.2px 0.2px rgba(0, 0, 0, 1)',
        '2xl-white': '0 0.2px 0.2px rgba(250, 250, 250, 1)',
        '2xl-red': '0 0.2px 0.2px rgba(250, 0, 0, 1)',
        '2xl-double': ['0 0.2px 0.2px rgba(250, 0, 0, 1)', '0 0.2px 0.2px rgba(0, 0, 0, 1)'],
        '3xl-black': '0 0.3px 0.3px rgba(0, 0, 0, 1)',
        '3xl-red': '0 0.3px 0.3px rgba(250, 0, 0, 1)',
        '5xl-black': '0 0.5px 0.5px rgba(0, 0, 0, 1)',
        '5xl-red': '0 0.5px 0.5px rgba(250, 0, 0, 1)',
      },
    },
  },

  backgroundImage: {},
  // eslint-disable-next-line no-undef
  plugins: [require('daisyui')],
};
