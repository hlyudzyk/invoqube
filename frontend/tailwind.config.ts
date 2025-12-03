import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#142039",  // Primary
          dark: "#0D1324",
          light: "#1F3158",
        },
        accent: {
          DEFAULT: "#FBE048",
          dark: "#E1C834",
          light: "#FFF278",
        },
        base: {
          white: "#FFFFFF",
          black: "#080808",
        },
      },
    },
  },
  plugins: [],
};
export default config;
