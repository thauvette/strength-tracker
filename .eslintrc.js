module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'preact',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
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
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': ['error', { allow: ['warn'] }],
    'id-length': [
      'error',
      { exceptions: ['i', 'j', 'e', '_', 'a', 'b', 'x', 'y'] },
    ],
  },
};
