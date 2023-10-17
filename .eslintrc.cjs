module.exports = {
  extends: ['plugin:prettier/recommended', 'plugin:playwright/playwright-test', 'eslint:recommended'],
  plugins: ['prettier', 'playwright'],
  env: {
    browser: true,
    es6: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        useTabs: false,
        tabWidth: 2
      }
    ],
    'playwright/expect-expect': 'warn',
    'playwright/no-focused-test': 'warn',
    'no-console': 'off',
    'no-useless-escape': 'off',
    'no-eval': 'error',
    'no-multi-spaces': 'error',
    'no-new': 'warn',
    'no-return-assign': 'warn',
    'comma-dangle': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'max-len': ['off', { code: 250, ignoreComments: true }],
    'new-cap': ['error', { newIsCap: true }],
    'new-parens': 'error',
    quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-var': 'warn',
    'no-unused-vars': ['warn', { vars: 'local' }]
  }
}
