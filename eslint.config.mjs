import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  // ─── Ignores ───────────────────────────────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'webpack.config.js', 'postcss.config.js'],
  },

  // ─── Base JS rules ────────────────────────────────────────
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ─── TypeScript rules (lightweight) ────────────────────────
  ...tseslint.configs.recommended,

  // ─── Prettier compat (disables formatting rules) ──────────
  prettier,

  // ─── Custom overrides ─────────────────────────────────────
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Variables sin usar → warn (permite prefijo _ para ignorar)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Imports no usados se marcan con la misma regla de arriba

      // Permite require() en archivos de config
      '@typescript-eslint/no-require-imports': 'off',

      // No forzar tipos explícitos en todo
      '@typescript-eslint/no-explicit-any': 'warn',

      // Permite funciones vacías (útil para placeholders)
      '@typescript-eslint/no-empty-function': 'off',

      // No molestar con console.log en dev
      'no-console': 'warn',

      // Preferir const sobre let cuando no se reasigna
      'prefer-const': 'warn',

      // No variables re-declaradas
      'no-redeclare': 'error',
    },
  },
]
