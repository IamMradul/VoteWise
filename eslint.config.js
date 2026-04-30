module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        navigator: "readonly",
        module: "readonly",
        encodeURIComponent: "readonly",
        setTimeout: "readonly",
        firebase: "readonly",
        gtag: "readonly",
        APP_CONFIG: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "warn",
      "eqeqeq": "warn"
    }
  }
];
