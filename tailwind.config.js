const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xss: "355px",
      ...defaultTheme.screens,
      xs: "520px",
      ...defaultTheme.screens,
    },
    extend: {},
  },
  variants: {},
  plugins: [],
};
