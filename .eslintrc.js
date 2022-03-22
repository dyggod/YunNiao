module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/eslint-recommended"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "parser": "@typescript-eslint/parser",
    "sourceType": "module",
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vue/multi-word-component-names': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        "tsx": 'never',
        "ts": 'never',
        "vue": 'never',
      },
    ],
  },
  "settings": {
    'import/resolver': {
      "typescript": {},
    },
  },
};
