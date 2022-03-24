module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    // node: true,?
    browser: true,
    es2021: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-base',
  ],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    // 'max-len': { code: 180 },
    'max-len': 'off',
    'no-console': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-undef': 'off',
  },
  ignorePatterns: [
    '**/dist/*.js',
  ],
};
