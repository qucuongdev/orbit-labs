export default [{
  files: ['src/global/**/*.{js,jsx}', 'src/App.jsx', 'scripts/*.mjs'],
  languageOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
    globals: Object.fromEntries(['window','document','location','history','fetch','URL','URLSearchParams','AbortController','Worker','self','performance','requestAnimationFrame','cancelAnimationFrame','setTimeout','clearTimeout','console','Buffer','process'].map(name=>[name,'readonly'])),
  },
  rules: { 'no-undef': 'error' },
}];
