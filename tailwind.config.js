// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "cs-blue": "#00d4ff",
        "cs-dark": "#0f0f23",
        "cs-purple": "#1a1a2e",
        "cs-accent": "#16213e",
        "cs-green": "#00ff88",
        "cs-red": "#ff6b6b",
        "cs-orange": "#ff8e53",
        rarity: {
          white: "#b0c3d9",
          blue: "#4b69ff",
          purple: "#8847ff",
          pink: "#d32ce6",
          red: "#eb4b4b",
          contraband: "#e4ae39",
        },
      },
      backgroundImage: {
        "cs-gradient": "linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e)",
        "cs-card":
          "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
        "cs-button": "linear-gradient(45deg, #00d4ff, #0099cc)",
        "cs-button-hover": "linear-gradient(45deg, #0099cc, #007399)",
      },
      boxShadow: {
        "cs-glow": "0 0 20px rgba(0, 212, 255, 0.3)",
        "cs-card": "0 10px 30px rgba(0, 0, 0, 0.3)",
        "cs-button": "0 4px 15px rgba(0, 212, 255, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
