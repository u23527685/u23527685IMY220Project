const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    entry: "./backend/server.js",
    output: {
        path: path.resolve(__dirname, "backend", "dist"),
        filename: "server.js",
        clean: true
    },
    mode: "development",
    externals: [nodeExternals()],
    externalsPresets: {
        node: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                targets: {
                                    node: "current"
                                },
                                modules: "commonjs"  // Convert to CommonJS
                            }]
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    }
};