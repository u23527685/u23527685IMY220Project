const path = require("path");
module.exports = {
    entry: "./frontend/src/index.js",
    output: {
        path: path.resolve("frontend","public"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash][ext][query]"
                }
            },
            {
                test: /\.svg$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[hash][ext][query]"
                }
            },
            {
                test: /\.css$/i,
                use: [
                "style-loader", // Injects styles into DOM
                "css-loader"    // Turns CSS into CommonJS modules
                ]
            }
        ]
    }
}