const { defineConfig } = require('cypress')

module.exports = defineConfig({
  experimentalStudio: true,
  e2e: {
    baseUrl: 'https://automationintesting.online/',
    env: {
      username: 'admin',
      password: 'password',
    },
  },
})
