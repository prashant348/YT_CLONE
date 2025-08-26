/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.html", // to watch html files
    "./src/js/*.js", // to watch js files
    "./src/pages/*.html", 
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}

