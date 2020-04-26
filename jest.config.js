module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.test.json",
    },
  },
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/app/**/*.ts",
    "<rootDir>/src/lib/**/*.ts",
  ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
