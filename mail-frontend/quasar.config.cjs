/* eslint-env node */
const { configure } = require('quasar/wrappers')

module.exports = configure(function (/* ctx */) {
  return {
    css: [],
    boot: ['axios'],
    extras: ['roboto-font', 'material-icons'],
    build: {
      vueRouterMode: 'hash',
    },
    devServer: {
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Dark', 'LocalStorage'],
    },
  }
})
