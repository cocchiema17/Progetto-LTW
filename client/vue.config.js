const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        logLevel: 'debug',
        ws: true, 
        secure: false,
        pathRewrite: { '^/api': '/api' },
      },
    }
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "Login App"
    }
  }
})
