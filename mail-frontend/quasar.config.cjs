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
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Dark', 'LocalStorage'],
    },
  }
})
