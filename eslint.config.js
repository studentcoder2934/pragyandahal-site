import js from '@eslint/js'

export default [
  { ignores: ['dist/**', '.build/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      globals: {
        console: 'readonly', process: 'readonly', URL: 'readonly',
        document: 'readonly', window: 'readonly', IntersectionObserver: 'readonly',
      },
    },
  },
]
