/* ESLint configuration for WebDriverIO MCP Server */
module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist/**', 'reports/**', 'node_modules/**', 'wdio.conf.ts'],
  rules: {
    'no-console': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['tests/**/*.ts', 'examples/**/*.ts'],
      rules: {
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/no-unnecessary-type-assertion': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
  ],
};
