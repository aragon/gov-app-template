import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@aragon/gov-ui-kit/tailwind.config")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./plugins/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@aragon/gov-ui-kit/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "rgb(var(--guk-color-primary-50) / <alpha-value>)",
          100: "rgb(var(--guk-color-primary-100) / <alpha-value>)",
          200: "rgb(var(--guk-color-primary-200) / <alpha-value>)",
          300: "rgb(var(--guk-color-primary-300) / <alpha-value>)",
          400: "rgb(var(--guk-color-primary-400) / <alpha-value>)",
          500: "rgb(var(--guk-color-primary-500) / <alpha-value>)",
          600: "rgb(var(--guk-color-primary-600) / <alpha-value>)",
          700: "rgb(var(--guk-color-primary-700) / <alpha-value>)",
          800: "rgb(var(--guk-color-primary-800) / <alpha-value>)",
          900: "rgb(var(--guk-color-primary-900) / <alpha-value>)",
        },

        warning: {
          100: "rgb(var(--guk-color-warning-100) / <alpha-value>)",
          200: "rgb(var(--guk-color-warning-200) / <alpha-value>)",
          300: "rgb(var(--guk-color-warning-300) / <alpha-value>)",
          400: "rgb(var(--guk-color-warning-400) / <alpha-value>)",
          500: "rgb(var(--guk-color-warning-500) / <alpha-value>)",
          600: "rgb(var(--guk-color-warning-600) / <alpha-value>)",
          700: "rgb(var(--guk-color-warning-700) / <alpha-value>)",
          800: "rgb(var(--guk-color-warning-800) / <alpha-value>)",
          900: "rgb(var(--guk-color-warning-900) / <alpha-value>)",
        },

        success: {
          100: "rgb(var(--guk-color-success-100) / <alpha-value>)",
          200: "rgb(var(--guk-color-success-200) / <alpha-value>)",
          300: "rgb(var(--guk-color-success-300) / <alpha-value>)",
          400: "rgb(var(--guk-color-success-400) / <alpha-value>)",
          500: "rgb(var(--guk-color-success-500) / <alpha-value>)",
          600: "rgb(var(--guk-color-success-600) / <alpha-value>)",
          700: "rgb(var(--guk-color-success-700) / <alpha-value>)",
          800: "rgb(var(--guk-color-success-800) / <alpha-value>)",
          900: "rgb(var(--guk-color-success-900) / <alpha-value>)",
        },

        critical: {
          100: "rgb(var(--guk-color-critical-100) / <alpha-value>)",
          200: "rgb(var(--guk-color-critical-200) / <alpha-value>)",
          300: "rgb(var(--guk-color-critical-300) / <alpha-value>)",
          400: "rgb(var(--guk-color-critical-400) / <alpha-value>)",
          500: "rgb(var(--guk-color-critical-500) / <alpha-value>)",
          600: "rgb(var(--guk-color-critical-600) / <alpha-value>)",
          700: "rgb(var(--guk-color-critical-700) / <alpha-value>)",
          800: "rgb(var(--guk-color-critical-800) / <alpha-value>)",
          900: "rgb(var(--guk-color-critical-900) / <alpha-value>)",
        },

        secondary: {
          100: "rgb(var(--guk-color-secondary-100) / <alpha-value>)",
          200: "rgb(var(--guk-color-secondary-200) / <alpha-value>)",
          300: "rgb(var(--guk-color-secondary-300) / <alpha-value>)",
          400: "rgb(var(--guk-color-secondary-400) / <alpha-value>)",
          500: "rgb(var(--guk-color-secondary-500) / <alpha-value>)",
          600: "rgb(var(--guk-color-secondary-600) / <alpha-value>)",
          700: "rgb(var(--guk-color-secondary-700) / <alpha-value>)",
          800: "rgb(var(--guk-color-secondary-800) / <alpha-value>)",
          900: "rgb(var(--guk-color-secondary-900) / <alpha-value>)",
        },

        negative: {
          200: "rgb(var(--guk-color-negative-200))",
          800: "rgb(var(--guk-color-negative-800))",
        },
      },
    },
  },
};
export default config;
