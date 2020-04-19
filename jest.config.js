module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.json",
    },
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(ts)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
