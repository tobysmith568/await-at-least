import recommended from "@tobysmith568/eslint-config";
import node from "@tobysmith568/eslint-config/node";
import prettier from "@tobysmith568/eslint-config/prettier";
import vitest from "@tobysmith568/eslint-config/vitest";
import { defineConfig } from "eslint/config";

export default defineConfig([
  recommended,
  node,
  { files: ["**/*.spec.ts"], extends: [vitest] },
  prettier
]);
