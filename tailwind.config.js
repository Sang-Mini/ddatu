/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "ddatu-green": "#00C073",
        "ddatu-navy": "#0A1628",
        "ddatu-gold": "#F5C842",
        "ddatu-bg": "#F7F8FA",
      },
    },
  },
  plugins: [],
};
