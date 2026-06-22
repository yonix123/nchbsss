import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#24AFE5", 
          700: "#036280", 
          900: "#1C8EB8",          
        },
        secondary: "#e9c45b",
      },
      fontFamily: {
        sans: ["AeonikPro", ...defaultTheme.fontFamily.sans],
      },
    },
  },
plugins: [],
};