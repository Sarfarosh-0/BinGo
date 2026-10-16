import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  {
    // Vendored/minified source, build output and Python training code are not linted.
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'public/**',
      'training/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // Only the two classic hook rules. eslint-plugin-react-hooks v7's
      // `recommended` set also turns on React-Compiler rules (set-state-in-effect,
      // immutability, ...) that flag legitimate patterns here, e.g. kicking off
      // an async model load from an effect.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      ...jsxA11y.configs.recommended.rules,
      // The codebase uses plain JS with no PropTypes (validated at the data layer instead).
      'react/prop-types': 'off',
    },
  },
  {
    files: [
      '*.config.js',
      'eslint.config.js',
      'scripts/**/*.mjs',
      'src/**/*.test.{js,jsx}',
      'src/test/**',
    ],
    languageOptions: { globals: { ...globals.node } },
  },
]
