/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte,md,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1f4693", 600: "#2a55ad", 400: "#5b82d6", 100: "#e7f0ff" },
        navy: { DEFAULT: "#0d1a36", 800: "#122a52" },
        gold: "#e0a234",
        cream: "#faf6ec",
        mist: "#f7f8fb",
      },
      fontFamily: {
        head: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
