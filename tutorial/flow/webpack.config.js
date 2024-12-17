const path = require("path");
const RunPlugin = require("./RunPlugin");
const DonePlugin = require("./DonePlugin");
module.exports = {
  context: process.cwd(),
  mode: "development",
  devtool: false,
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        include: path.join(__dirname, "src"),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new RunPlugin(),new DonePlugin()],
  devServer: {},
};
