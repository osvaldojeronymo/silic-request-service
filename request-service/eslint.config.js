// eslint.config.js
import js from '@eslint/js';
import ts from 'typescript-eslint';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      '*.min.js',
      'assets/js/index-clean.js',
      'assets/js/index.js',
      'force_modal_test.js',
      'test_switch.js',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-undef': 'off', // TS já cobre
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];
