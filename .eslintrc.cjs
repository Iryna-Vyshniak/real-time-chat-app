module.exports = {
  root: true,
  env: { node: true, es2021: true, commonjs: true },
  extends: ['standard', 'prettier'],
  ignorePatterns: ['.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {},
};
