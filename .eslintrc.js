module.exports = {
  extends: ["eslint:recommended", "plugin:vue/essential"],
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  globals: {
    importName: true,
    __dirname: true,
    process: true,
    path: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    semi: 2,
    "no-irregular-whitespace": "off",
    "no-console": "off"
  }
};
