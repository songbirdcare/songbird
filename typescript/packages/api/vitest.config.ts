import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "Songbird API",
    setupFiles: ["./src/tests/setup.ts"],
    useAtomics: true,
    env: {
      SQL_URI:
        "postgres://postgres:postgres@localhost:5432/songbird-test?sslmode=disable",
    },
  },
});
