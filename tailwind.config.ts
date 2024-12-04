import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // تفعيل الوضع الداكن باستخدام الفئات
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      boxShadow: {
        "custom-light": "0 4px 6px rgba(0, 0, 0, 0.1)",
        "custom-dark": "0 8px 15px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
