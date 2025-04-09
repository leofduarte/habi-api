const { defineConfig } = require("eslint/config");
const globals = require("globals");
const js = require("@eslint/js");

module.exports = defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    files: ["**/*.{js,mjs,cjs}"], languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    }
  },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], rules: { "no-console": "off" } },
  { files: ["**/*.{js,mjs,cjs}"], rules: { "no-unused-vars": "warn" } },
  { files: ["**/*.{js,mjs,cjs}"], rules: { "no-undef": "error" } },
  { files: ["**/*.{js,mjs,cjs}"], rules: { "no-unused-expressions": "error" } },
  { files: ["**/*.{js,mjs,cjs}"], rules: { "prefer-const": "error" } },
]);