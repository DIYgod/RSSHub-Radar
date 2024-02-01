module.exports = {
  singleQuote: false,
  semi: false,
  trailingComma: "all",
  endOfLine: "lf",
  plugins: ["prettier-package-json", "@ianvs/prettier-plugin-sort-imports"],

  importOrderParserPlugins: [
    "classProperties",
    "decorators-legacy",
    "typescript",
    "jsx",
  ],
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "",
    "^@(.*)/(.*)$",
    "",
    "^~/(.*)$",
    "",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
}
