module.exports = {
  root: true,
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  plugins: ["prettier", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        directory: "./tsconfig.json",
      },
    },
  },
  rules: {
    "import/prefer-default-export": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.spec.ts"],
      parserOptions: {
        project: "./tsconfig.test.json",
      },
      plugins: ["jest"],
      env: { jest: true },
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
