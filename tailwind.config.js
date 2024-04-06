/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        secondary: {
          100: "#DEE5E5",
          200: "#DEE5E5",
        },
        primary: {
          100: "#191919",
          200: "#292929",
          300: "#393939",
        },
      },
    },
  },
  plugins: [],
};
