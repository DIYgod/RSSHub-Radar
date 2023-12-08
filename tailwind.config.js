import { addDynamicIconSelectors } from "@iconify/tailwind"

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  plugins: [
    addDynamicIconSelectors(),
  ]
}