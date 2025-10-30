const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: "./backend/server.js",
  output: {
    path: path.resolve(__dirname, "backend", "dist"),
    filename: "server.js",
    clean: true
  },
  mode: "development",

  // Prevent bundling of node_modules
  externals: [nodeExternals()],
  externalsPresets: { node: true },

  module: {
    rules: [
      // Transpile JS for Node
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { node: "current" },
                  modules: "commonjs"
                }
              ]
            ]
          }
        }
      },

      //Ignore CSS imports in backend
      {
        test: /\.css$/i,
        use: "null-loader"
      },

      //Ignore image & SVG imports in backend
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: "null-loader"
      }
    ]
  },

  resolve: {
    extensions: [".js"]
  }
};
