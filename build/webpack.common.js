const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: {
    background: './src/background/index.js',
    jobs: './src/jobs/index.js'
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../angelext')
  },
  mode: 'development',
  plugins: [
    new CopyPlugin([
      { from: 'src/extension' }
    ]),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
};
