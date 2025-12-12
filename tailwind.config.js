/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ecf6ff",
          100: "#d4e9ff",
          200: "#a8d4ff",
          300: "#7ab9ff",
          400: "#4d9cff",
          500: "#2f7fe6",
          600: "#1f63b4",
          700: "#164a86",
          800: "#0e3258",
          900: "#081f38"
        },
        accent: {
          500: "#7b7ff6",
          600: "#5a5fd8"
        },
        glass: "rgba(255,255,255,0.7)"
      },
      boxShadow: {
        soft: "0 10px 50px rgba(15, 23, 42, 0.12)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.1)"
      }
    }
  },
  plugins: []
};
