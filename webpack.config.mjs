import path from 'path';

export default {
  experiments: {
    outputModule: true
  },
  mode: 'production',
  entry: './dist/index.js',
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'index.js',
    library: {
      type: 'module'
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.json$/,
        type: 'json'
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fullySpecified: false
  },
};
