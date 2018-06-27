const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = {
  output: {
    filename: '[name].bundle.js',
  },
  mode: 'development',
  module: {
    rules: []
  },
  plugins: [
  ]
};


const runWebpack = async (config) => {
  config = merge(config, commonConfig);

  return new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.compilation.errors.length > 0) {
        return reject(stats.compilation.errors[0]);
      }

      const files = stats.compilation.chunks.reduce((files, x) => files.concat(x.files), []);

      resolve(files);
    });
  });
};
 module.exports = {
   runWebpack
 };