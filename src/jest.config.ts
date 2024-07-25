import type { Config } from "jest";

const config: Config = {
  collectCoverage: false,
  roots: ["./tests"],
  // coverageDirectory: "./coverage",
  // collectCoverageFrom: [
  //   "**/*.{js,jsx}",
  //   "!**/node_modules/**",
  //   "!**/vendor/**",
  // ],
  // coverageReporters: ["clover", "json", "lcov", ["text", { skipFull: true }]],
};

export default config;
