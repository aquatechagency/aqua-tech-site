module.exports = {
  darkMode: "class",
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        "surface-container-lowest": "#010f1f",
        "surface-container-low": "#0d1c2d",
        "surface-container": "#122131",
        "surface-container-high": "#1c2b3c",
        "surface-container-highest": "#273647",
        background: "#051424",
        surface: "#051424",
        primary: "#8aa8c2",
        "primary-container": "#2e8fd9",
        "primary-fixed": "#c9e6ff",
        "on-primary": "#00344d",
        "on-primary-fixed": "#001e2f",
        "on-background": "#d4e4fa",
        "on-surface": "#d4e4fa",
        "on-surface-variant": "#bdc8d2",
        outline: "#87929c",
        "outline-variant": "#3e4851",
        secondary: "#bec6e0",
        "tertiary-fixed-dim": "#bcc7de",
      },
      // Canonical radius/spacing scale — src/input.css and the :root block in
      // src/template.html mirror these numbers so there is one source of truth
      // instead of three independently-set scales.
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "999px",
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "24px",
        "stack-lg": "48px",
        gutter: "24px",
        "margin-mobile": "16px",
        "section-padding": "120px",
        "section-space": "clamp(5.5rem, 8vw, 8rem)",
        "container-max": "1280px",
      },
      fontFamily: {
        "headline-xl": [
          '"Space Grotesk"',
          '"Alexandria"',
          "system-ui",
          "sans-serif",
        ],
        "headline-lg": [
          '"Space Grotesk"',
          '"Alexandria"',
          "system-ui",
          "sans-serif",
        ],
        "headline-md": [
          '"Space Grotesk"',
          '"Alexandria"',
          "system-ui",
          "sans-serif",
        ],

        "body-md": ['"Manrope"', '"Alexandria"', "system-ui", "sans-serif"],
        "body-lg": ['"Manrope"', '"Alexandria"', "system-ui", "sans-serif"],

        "label-sm": ['"Space Grotesk"', '"Alexandria"', "monospace"],
      },
      fontSize: {
        "headline-xl": [
          "48px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": ["24px", { lineHeight: "1.4", fontWeight: "600" }],
        "headline-lg-mobile": [
          "28px",
          { lineHeight: "1.3", fontWeight: "600" },
        ],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": [
          "12px",
          { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "500" },
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
