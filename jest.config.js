// https://nextjs.org/docs/app/building-your-application/testing/jest

const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "clover"],
  verbose: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(d3-interpolate)/)"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
