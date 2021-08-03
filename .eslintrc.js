module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    commonjs: true,
  },
  extends: ["eslint:recommended", "plugin:vue/essential", "plugin:jest/all"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["vue", "jest"],
  rules: {
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/no-hooks": [
      "error",
      {
        allow: ["beforeEach"],
      },
    ],
    "jest/prefer-expect-assertions": ["off"],
    "jest/prefer-strict-equal": ["off"],
  },
  settings: {
    jest: {
      version: 26,
    },
  },
};
