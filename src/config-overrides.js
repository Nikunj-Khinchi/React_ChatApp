const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    "stream": require.resolve("stream-browserify"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "crypto": require.resolve("crypto-browserify"),
    "buffer": require.resolve("buffer/")
  };
  
  return config;
}
