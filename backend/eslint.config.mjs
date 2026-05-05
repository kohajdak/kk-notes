// backend/eslint.config.mjs
import { defineConfig } from "eslint/config";
import js from "@eslint/js";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script"
    },
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": ['warn', { argsIgnorePattern: '^_' }],
      "no-undef": "warn"
    }
  },

  {
    files: ["backend/**", "index.js", "db.js", "config/**", "migrations/**", "models/**"],
    languageOptions: {
      globals: {
        process: "readonly",
        require: "readonly",
        module: "writable",
        __dirname: "readonly",
        console: "readonly"
      },
      sourceType: "script"
    },
    rules: {
    }
  },

  {
    files: ["**/tests/**", "**/*.test.js"],
    languageOptions: {
      globals: {
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
        process: "readonly",
        require: "readonly",
        module: "writable"
      },
      sourceType: "script"
    }
  }
]);
