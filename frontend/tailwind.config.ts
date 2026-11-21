import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // JAHM palette — taken from the brand logo
        rose: { DEFAULT: "#A3545C", dark: "#86404A", light: "#C98A90" },
        blush: { DEFAULT: "#F7E4E4", soft: "#FBEFEF", deep: "#EFCFD1" },
        cream: "#FCF8F6",
        plum: { DEFAULT: "#5A2B35", dark: "#43202A" },
        gold: { DEFAULT: "#C29B57", light: "#E3C98F" },
        ink: "#2B2024",
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Jost"', "system-ui", "sans-serif"],
        script: ['"Great Vibes"', "cursive"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(90, 43, 53, 0.18)",
      },
    },
  },
  plugins: [],
};
export default config;
