const { resolve } = require('path');

module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: resolve(__dirname, 'tsconfig.json')
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': 'off',
    camelcase: 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }]
  },
  env: {
    node: true,
    es6: true,
    commonjs: true,
    jest: true
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.d.ts', '.tsx', '.js']
      }
    }
  },
  overrides: [
    {
      files: ["*.spec.ts"],
      // FIXME: todo
    }
  ]
};
