const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');


console.log(`dirname:`, __dirname);

module.exports = (env) => {
  console.log(`env:`, env);
  const ENTRY_FILE = path.resolve(__dirname, 'src', env.entry);
  const OUTPUT_PATH = path.resolve(__dirname, 'build');
  const OUTPUT_FILE = env.app;
  
  console.log({ ENTRY_FILE, OUTPUT_PATH, OUTPUT_FILE });

  return {
    target: 'node',
    mode: 'none',
    externals: [nodeExternals()],
    entry: ENTRY_FILE,
    devtool: "inline-source-map",
    output: {
      path: OUTPUT_PATH,
      filename: OUTPUT_FILE,
      libraryTarget: 'commonjs2'
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
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@lib/shared':  path.resolve(__dirname, 'src/lib/index.ts')
      },
    },

    plugins: [
      new NodemonPlugin()
    ]
  };
};