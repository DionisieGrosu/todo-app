/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mregular: ["Montserrat-Regular"],
        mmedium: ["Montserrat-Medium"],
        msemibold: ["Montserrat-SemiBold"],
        sregular: ["SpaceMono-Regular"],
        bregular: ["BebasNeue-Regular"],
      },
      colors: {
        "custom-orange": "#F79E89",
        "dark-orange": "#F76C6A",
        "custom-green": "#00FF19",
      },
    },
  },
  plugins: [],
};
