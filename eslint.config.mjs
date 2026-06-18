import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';
import hooksPlugin from 'eslint-plugin-react-hooks';
import tseslint, { parser } from 'typescript-eslint';
import perfectionist from 'eslint-plugin-perfectionist';
import unusedImports from 'eslint-plugin-unused-imports';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['./eslint.config.mjs', 'src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      perfectionist,
      'unused-imports': unusedImports,
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      globals: globals.browser,
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      'no-alert': 0,
      camelcase: 0,
      'no-console': 1,
      'no-unused-vars': 0,
      'no-param-reassign': 0,
      'no-underscore-dangle': 0,
      'no-restricted-exports': 0,
      'jsx-a11y/anchor-is-valid': 0,
      'react/no-array-index-key': 0,
      'no-promise-executor-return': 0,
      'import/prefer-default-export': 0,
      'jsx-a11y/control-has-associated-label': 0,
      'prefer-destructuring': [
        1,
        {
          object: true,
          array: false,
        },
      ],

      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/lines-between-class-members': 'off',
      '@typescript-eslint/no-throw-literal': 'off',

      'unused-imports/no-unused-imports': 1,
      'unused-imports/no-unused-vars': [
        1,
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^ignore',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'perfectionist/sort-named-imports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-named-exports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-exports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
      'perfectionist/sort-imports': [
        1,
        {
          order: 'asc',
          type: 'line-length',
        },
      ],
    },
  },

  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: { ...hooksPlugin.configs.recommended.rules },
  },

  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // {
  //   ...eslintPluginPrettierRecommended,
  //   rules: {
  //     ...eslintPluginPrettierRecommended.rules,
  //     'prettier/prettier': [
  //       'error',
  //       {
  //         endOfLine: 'auto',
  //       },
  //     ],
  //   },
  // },
];
