module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'preact',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 0,
  },
};
