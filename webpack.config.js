const path = require('path');

module.exports = {
  entry: {
    'main': './src/index.ts',
    'solver-worker': './src/solver-worker.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  watchOptions: {
    ignored: /node_modules/
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs/js'),
  },
};