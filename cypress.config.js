const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://automationintesting.online/',
    env: {
      username: 'admin',
      password: 'password',
    },
  },
})
