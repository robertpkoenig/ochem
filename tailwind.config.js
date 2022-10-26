const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", "sans-serif"],
      },
      width: {
        1200: "1200px",
        40: "40px",
      },
      height: {
        40: "40px",
        700: "700px",
      },
      translate: {
        n50: "-50%",
      },
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
      backgroundColor: ["disabled"],
      cursor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
