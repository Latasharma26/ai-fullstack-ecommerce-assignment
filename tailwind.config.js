/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hydra: {
          cyan: "#00D5FD",
          cyanHover: "#02D3FC",
          cyanDark: "#1DAEC6",
          cyanBg: "#F3FDFF",
          cyanLight: "#DAF6FF",
          purpleDark: "#2A1850",
          purpleMid: "#76468A",
          purpleLight: "#B199BA",
          purpleSoft: "#D5CBD9",
          night: "#040C1E",
        },
        border: "hsl(var(--border, 214.3 31.8% 91.4%))",
        input: "hsl(var(--input, 214.3 31.8% 91.4%))",
        ring: "hsl(var(--ring, 189 94% 43%))",
        background: "hsl(var(--background, 0 0% 100%))",
        foreground: "hsl(var(--foreground, 222.2 84% 4.9%))",
        primary: {
          DEFAULT: "#00D5FD",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2A1850",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 210 40% 96.1%))",
          foreground: "hsl(var(--muted-foreground, 215.4 16.3% 46.9%))",
        },
        accent: {
          DEFAULT: "#00D5FD",
          foreground: "#040C1E",
        },
      },
      fontFamily: {
        bison: ["'Bison'", "'Montserrat'", "'Impact'", "'Arial Black'", "sans-serif"],
        script: ["'Kaushan Script'", "'Playfair Display'", "cursive"],
        guthen: ["'Guthen Bloots'", "'Kaushan Script'", "cursive"],
        title: ["'Montserrat'", "'Poppins'", "sans-serif"],
        sans: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" },
        },
        "logo-flip": {
          "0%": { opacity: "0", transform: "perspective(600px) rotateY(90deg) scale(0.8)" },
          "60%": { opacity: "1", transform: "perspective(600px) rotateY(-8deg) scale(1.04)" },
          "80%": { transform: "perspective(600px) rotateY(4deg) scale(0.98)" },
          "100%": { opacity: "1", transform: "perspective(600px) rotateY(0deg) scale(1)" },
        },
      },
      animation: {
        "spin-slow": "spin-slow 20s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "logo-flip": "logo-flip 0.9s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};
