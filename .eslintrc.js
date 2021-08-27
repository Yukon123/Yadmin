module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',

    '@vue/prettier',

    'eslint:recommended',

    '@vue/typescript/recommended',

    '@vue/prettier/@typescript-eslint',

    'plugin:prettier/recommended',
  ],
  // globals: {
  //   document: true,
  //   localStorage: true,
  //   window: true,
  // },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'no-undef': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },

  /* 指定如何解析语法。可以为空，但若不为空，只能配该值*/

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 2020,

    parser: '@typescript-eslint/parser',
  },

  overrides: [
    {
      files: ['**__tests__*.{j,t}s?(x)'],

      env: {
        mocha: true,
      },
    },
  ],
}
